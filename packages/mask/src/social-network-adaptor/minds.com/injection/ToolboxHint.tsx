import { MutationObserverWatcher } from '@dimensiondev/holoflows-kit'
import { createReactRootShadowed } from '../../../utils/shadow-root/renderInShadowRoot'
import { startWatch } from '../../../utils/watcher'
import { toolboxInSidebarSelector } from '../utils/selector'
import { ToolboxHintAtMinds } from './ToolboxHint_UI'

export function injectToolboxHintAtMinds(signal: AbortSignal, category: 'wallet' | 'application') {
    const watcher = new MutationObserverWatcher(toolboxInSidebarSelector())
    startWatch(watcher, signal)
    createReactRootShadowed(watcher.firstDOMProxy.afterShadow, { signal }).render(
        <ToolboxHintAtMinds category={category} />,
    )
}
