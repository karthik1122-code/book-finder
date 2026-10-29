# Interview corner

## What causes a component to re-render? How does React.memo change that?

A component re-renders when its own state changes, when its parent re-renders, or when a context it uses changes. The parent one is the surprising part: by default every child re-renders too, even if its props are the same. React.memo stops that. It compares the new props with the old ones (shallowly), and if nothing changed it skips the render. That's why the functions you pass to memo components need useCallback.

## What is the dependency array for, and what goes wrong if you leave out a dependency?

It tells React when to re-run an effect (or recalculate useMemo/useCallback). The effect runs again only when one of those values changes. If you leave a dependency out, the effect keeps using the old value from the render it was created in. That's a stale closure. For example, in useFetch, if I left out `url`, it would never fetch again when the search changed.

## State the rules of hooks, and explain why hooks cannot be called inside an if statement.

Only call hooks at the top level of a component or a custom hook, never inside loops, conditions or nested functions. And only call them from React components or custom hooks. React doesn't know hooks by name. It tracks them by the order they're called in each render. If a hook sits inside an if, the order can change between renders, and React gives one hook's state to another.
