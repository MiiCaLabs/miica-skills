# KB-04: Mobile Ergonomics (HIG / Material 3), Performance, and Accessibility

## 1. Platform fidelity and form factors

- **iOS (*Human Interface Guidelines*):**
  - Respect native stack navigation (`NavigationStack`), sheet modals (*Sheet* with detents), the native swipe-back gesture from the left edge, and *Safe Areas* (notch, *Dynamic Island*, Home indicator).
- **Android (*Material 3*):**
  - **Edge-to-Edge mandatory:** enforced when targeting API 35, with no escape hatch when targeting API 36 (`windowOptOutEdgeToEdgeEnforcement` is ignored). The app correctly consumes `WindowInsets` (status bar, navigation bar, IME keyboard).
  - **Predictive Back gesture:** enabled by default when targeting API 36, where `onBackPressed()` and `KEYCODE_BACK` are no longer called. Migrate to `OnBackPressedCallback` / `OnBackInvokedCallback`.
  - **Large screens (API 36):** above 600 dp, Android ignores declared orientation, aspect-ratio and resizability restrictions. Test layouts in landscape and free-form windows.
- **Tablets, foldables, and keyboard:**
  - Use adaptive layouts (`WindowSizeClass` on Android, `horizontalSizeClass` on iOS: simple list on compact, side-by-side *Master-Detail* on wide screens).
  - Always provide scrolling (*ScrollView*) and repositioning above the virtual keyboard on forms.

## 2. Perceived performance and offline UX

- **Cold start < 1.5 seconds:**
  - Never synchronously initialize analytics SDKs, crash reporting, heavy databases, or network dependencies in `Application.onCreate()` / `AppDelegate.didFinishLaunching`. Use lazy or asynchronous initialization after first render.
  - Use the system `SplashScreen` API (Android) and `LaunchScreen.storyboard` (iOS) without an artificial blocking loading screen.
- **Offline state transparency:**
  - Never leave the user on an infinite spinner in a dead zone. Immediately show cached local data with a clear timestamp (*"Updated 12 min ago"*) and a discreet indicator for actions pending in the outbox (*"2 approvals waiting for network"*).
  - **Bounded optimistic UI:** Update the interface instantly for fluid actions (favorites, acknowledgement) with a visual *pending* state and an explicit rollback + *Retry* action on definitive server rejection (`4xx`).

## 3. Mobile accessibility (WCAG 2.2 AA / European Accessibility Act)

- **Dynamic Type / font scaling:** Support system font enlargement **up to 200%** with no truncated text (no abusive `ellipsize`) or overlapping components (switch from a horizontal row to a vertical column when the scale passes a threshold).
- **Minimum touch targets:** **44 x 44 pt** minimum on iOS and **48 x 48 dp** minimum on Android for any button or tappable area (extend the *hit area* if needed).
- **Screen readers (VoiceOver / TalkBack):**
  - Semantically group composite cards (for example title + subtitle + badge read as one logical announcement rather than 4 swipes).
  - Explicitly expose roles (`Button`, `Header`, `Selected`), states, and labels (`accessibilityLabel` / `contentDescription`), hiding purely decorative icons.
- **Motion and contrast:** Respect `UIAccessibility.isReduceMotionEnabled` / `ANIMATOR_DURATION_SCALE`, support native dark mode, and guarantee **4.5:1** contrast on text.
