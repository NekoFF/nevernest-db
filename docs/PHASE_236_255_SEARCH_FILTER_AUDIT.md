# Phase 236-255 Search/Filter Audit

Date: 2026-05-19

## Scope

Static-first read-only search and browse filters were reviewed for Characters, Weapons, Modules, Codes, News, Vehicles, Guides, and global Topbar discovery.

## Result

- Global search indexes characters, weapons, cartridges, module pieces, vehicles, codes, news, and planned guides.
- Search index entries now include public route metadata and exclude admin/dev/private routes.
- Search scoring now always includes category labels, so broad player queries such as `code`, `vehicle`, and `news` discover useful results even when an item has custom search text.
- Search tests cover normalization, token matching, character, weapon, cartridge/module, code, news, vehicle, no-result behavior, public routes, and source-status discovery mapping.
- Page filters remain static/localStorage compatible and do not require DB access.

## Safety

No backend mutation endpoints, DB schema changes, auth changes, production admin writes, public registration, or API-default behavior were added.

