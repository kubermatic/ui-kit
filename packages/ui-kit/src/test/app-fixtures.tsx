/*
 * Copyright 2026 The Kubermatic Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Sample data for the app-frame and template stories.
 *
 * Lives under `test/` because it ships nowhere: the directory is excluded from
 * `tsconfig.build.json` and from the coverage report. Real products describe
 * their navigation in exactly this shape — an array of sections, hand-rendered
 * — so the stories show the real thing rather than a simplification of it.
 */
import {
  Database,
  KeyRound,
  LayoutDashboard,
  Lock,
  Network,
  Radio,
  Rocket,
  RotateCw,
  Send,
  Server,
  Settings,
  Share2,
  Shapes,
} from 'lucide-react';

import type { Brand } from '@/components/ui/brand';
import type { NavSection } from '@/components/ui/sidebar';

export const CONSOLE: Brand = {
  name: 'Example Console',
  shortName: 'EC',
  company: 'Kubermatic',
  docsUrl: 'https://example.com/docs',
};

export const PLATFORM: Brand = {
  name: 'Example Platform',
  shortName: 'EP',
  company: 'Kubermatic',
  docsUrl: 'https://example.com/docs',
};

/** A flat, ungrouped navigation, as the component takes it. */
export const CONSOLE_NAV: NavSection[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '#dashboard', icon: <LayoutDashboard /> }],
  },
  {
    label: 'Secrets',
    items: [
      { label: 'External Secrets', href: '#external-secrets', icon: <KeyRound />, isActive: true },
      { label: 'Secret Stores', href: '#secret-stores', icon: <Database /> },
      { label: 'Push Secrets', href: '#push-secrets', icon: <Send /> },
      { label: 'Secrets', href: '#secrets', icon: <Lock />, badge: '42' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Event Stream', href: '#event-stream', icon: <Radio /> },
      { label: 'Visualization', href: '#visualization', icon: <Network /> },
      { label: 'Reloaders', href: '#reloaders', icon: <RotateCw /> },
    ],
  },
  {
    label: 'Fleet',
    items: [
      { label: 'Clusters', href: '#clusters', icon: <Server /> },
      { label: 'ESO Deployments', href: '#eso-deployments', icon: <Rocket /> },
      { label: 'Federation', href: '#federation', icon: <Share2 /> },
    ],
  },
];

/** A grouped navigation, with a nested service tree and a pinned footer group. */
export const PLATFORM_NAV: NavSection[] = [
  {
    label: 'Organization',
    items: [
      { label: 'Projects', href: '#projects', icon: <Shapes /> },
      { label: 'Members', href: '#members', icon: <Server /> },
      { label: 'Namespaces', href: '#namespaces', icon: <Database /> },
    ],
  },
  {
    label: 'Services',
    items: [
      {
        label: 'Postgres',
        href: '#postgres',
        icon: <Database />,
        collapsible: true,
        items: [
          { label: 'billing-db', href: '#billing-db', isActive: true },
          { label: 'checkout-db', href: '#checkout-db' },
        ],
      },
      {
        label: 'Redis',
        href: '#redis',
        icon: <Lock />,
        collapsible: true,
        items: [{ label: 'session-cache', href: '#session-cache' }],
      },
      {
        label: 'Blueprints',
        href: '#blueprints',
        icon: <Rocket />,
        disabled: true,
        disabledReason: 'Blueprints are not enabled for this organization',
      },
    ],
  },
];

export const PLATFORM_NAV_FOOTER: NavSection[] = [
  {
    items: [{ label: 'Settings', href: '#settings', icon: <Settings /> }],
  },
];

export const USER = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
};
