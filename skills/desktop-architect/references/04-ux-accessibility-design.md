# KB-04: Desktop Ergonomics (UI/UX), Accessibility, and Design System

## 1. Desktop ergonomics standards

- **Platform fidelity:** Follow the *Human Interface Guidelines* (macOS: global menu bar, `Cmd` shortcuts, controls on the left) and *Fluent Design* (Windows: controls on the right, `Ctrl` shortcuts).
- **Multi-monitor handling:** Save window position and size in the local database and always validate at startup that the window falls within the geometry of a currently connected monitor (fall back to the primary screen if an external display was unplugged or the DPI changed).
- **Progressive (just-in-time) permissions:** Never request access to protected folders (macOS TCC), notifications, or auto-start on the first screen; trigger the request only on the matching user action, with a direct link to *System Settings* if denied.

## 2. Keyboard productivity and visual performance

- **Command palette (`Cmd+K` / `Ctrl+K`):** Universal entry point to search an entity, trigger an action, switch workspace, or open the *Doctor* view without leaving the keyboard.
- **Components and virtualization:**
  - Under **Tauri**: DOM virtualization (`@tanstack/virtual`) from 100 rows for lists and log streams, optimistic UI with automatic rollback on IPC failure.
  - Under **GPUI**: strict separation between stateless components (`#[derive(IntoElement)]` + `RenderOnce`) and reactive entities (`Entity<T>`), with systematic virtualization via `uniform_list` / `list`.
- **Visual conflict resolution:** Side-by-side interface (Local vs Remote) showing metadata (author, timestamp, hash) and explicit actions (*Keep Local*, *Accept Remote*, *Merge*).

## 3. Accessibility (WCAG 2.2 AA): technical reality

- **Functional requirements:** Full keyboard navigation (logical tab order, focus traps in modals, closing with `Escape`), minimum contrast of **4.5:1** (text) / **3:1** (icons), native system dark/light mode support, and `prefers-reduced-motion`.
- **Impact on technology choice:**
  - **Tauri v2:** Natively benefits from the DOM/ARIA accessibility tree interpreted by **VoiceOver** (macOS) and **Narrator/NVDA** (Windows). WCAG 2.2 AA is directly reachable at a manageable cost.
  - **GPUI:** Does not provide ready-made full coverage for screen readers and ARIA semantics. If **WCAG 2.2 AA** is a contractual enterprise requirement, choose **Tauri v2**.
