#!/usr/bin/env bash

# Copyright 2026 The Kubermatic Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

### Shared helpers for the scripts in hack/ci. Sourced, never executed.

# Timestamped log line. Prow's build log has no timestamps of its own, so
# without this you cannot tell a slow job from a hung one.
echodate() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')]" "$@"
}

# retry <attempts> <command...>
#
# Everything here that touches the network is retried: the npm registry is not
# a dependency we control, and a single 503 during `npm ci` should not turn a
# green PR red.
retry() {
  local attempts=$1
  shift

  local attempt=1
  until "$@"; do
    if [ $attempt -ge "$attempts" ]; then
      echodate "Command failed after $attempts attempts: $*"
      return 1
    fi

    local wait=$((attempt * 10))
    echodate "Attempt $attempt/$attempts failed, retrying in ${wait}s…"
    sleep $wait
    attempt=$((attempt + 1))
  done
}

# Install dependencies exactly as the lockfile describes them.
#
# There is no equivalent of actions/cache in Prow, so this runs cold in every
# job. It is the single largest chunk of wall-clock time in CI, and the reason
# the presubmit is one job and not four — see the header of hack/ci/verify.sh.
npm_ci() {
  echodate "Installing dependencies…"
  retry 3 npm ci
  echodate "Dependencies installed."
}

# Copy a build result into Prow's artifact directory, from where the sidecar
# uploads it to GCS and Spyglass renders it. $ARTIFACTS is only set when the
# job is decorated, so running these scripts locally is still fine.
collect_artifact() {
  local path="$1"

  if [ -z "${ARTIFACTS:-}" ]; then
    echodate "\$ARTIFACTS is not set, leaving $path in place."
    return 0
  fi

  if [ ! -e "$path" ]; then
    echodate "$path does not exist, nothing to collect."
    return 0
  fi

  echodate "Collecting $path…"
  mkdir -p "$ARTIFACTS"
  cp -r "$path" "$ARTIFACTS/"
}

# The gh CLI is not in any of the images these jobs run on, and it is only
# needed by the release job, so it is fetched rather than baked in.
install_gh() {
  local version="2.83.1"

  if command -v gh > /dev/null; then
    return 0
  fi

  echodate "Installing gh $version…"
  retry 3 curl --fail --silent --show-error --location \
    "https://github.com/cli/cli/releases/download/v${version}/gh_${version}_linux_amd64.tar.gz" |
    tar xz -C /tmp
  mv "/tmp/gh_${version}_linux_amd64/bin/gh" /usr/local/bin/gh
}

# Install the browser the accessibility suite needs.
#
# The jobs run on quay.io/kubermatic/build, which carries Go, kind, vault and
# docker but no browsers, so Chromium is a ~115 MB download per run. The
# alternative was mcr.microsoft.com/playwright, which ships it preinstalled but
# has to have its tag bumped in lockstep with the `playwright` pin in
# package.json or it silently downloads the browser anyway — and it only
# applied while the suite had a pod of its own.
#
# The version is never named here. `playwright install` reads it from the
# installed package, so the lockfile is the single source of truth.
playwright_chromium() {
  echodate "Installing Chromium for Playwright, into ${PLAYWRIGHT_BROWSERS_PATH:-the default cache location}…"

  # --with-deps is apt-get, so it needs root and a Debian-family image. Both
  # hold on the build image; the fallback is for anything else, and lets the
  # suite report a missing shared library itself rather than failing here with
  # a permission error that says nothing about the cause.
  if [ "$(id -u)" = 0 ]; then
    retry 3 npx playwright install --with-deps chromium
  else
    echodate "Not running as root, installing the browser without its system packages."
    retry 3 npx playwright install chromium
  fi

  echodate "Chromium installed."
}

# Exchange the AppRole credentials Prow injects for a Vault token.
#
# $VAULT_ADDR, $VAULT_ROLE_ID and $VAULT_SECRET_ID all come from the
# `preset-vault` label on the job; a job without that label reaches this with
# none of them set, which is the failure this checks for. Same shape as the
# helper of the same name in developer-platform-dashboard — Vault is entered
# the same way everywhere, and the build image already carries the CLI.
vault_ci_login() {
  # Already logged in, e.g. when running this locally after `vault login`.
  if [ -n "${VAULT_TOKEN:-}" ]; then
    return 0
  fi

  if [ -z "${VAULT_ROLE_ID:-}" ] || [ -z "${VAULT_SECRET_ID:-}" ]; then
    echodate "ERROR: \$VAULT_ROLE_ID and \$VAULT_SECRET_ID must be set. Is the preset-vault label on this job?"
    return 1
  fi

  local token
  token=$(vault write --format=json auth/approle/login "role_id=$VAULT_ROLE_ID" "secret_id=$VAULT_SECRET_ID" | jq -r '.auth.client_token')

  export VAULT_TOKEN="$token"
}

# Point `origin` at an HTTPS URL that carries the bot token.
#
# Prow clones over SSH with a deploy key that is not allowed to push, and
# x-access-token is how a token authenticates over HTTPS instead. The awkward
# part is that there may be no `origin` to rewrite: clonerefs fetches the refs
# by URL into a `git init`ed directory, and whether it leaves a remote behind
# depends on the decoration — so `git remote set-url` fails with "No such
# remote 'origin'" on a tree that is otherwise checked out correctly.
#
# Written as remove-then-add rather than a set-url/add branch because the
# outcome is the same either way and this states it once.
set_push_remote() {
  local url="$1"

  git remote remove origin > /dev/null 2>&1 || true
  git remote add origin "$url"
}
