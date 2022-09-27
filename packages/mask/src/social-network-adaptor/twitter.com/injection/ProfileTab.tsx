import Color from 'color'
import { useEffect, useState } from 'react'
import { makeStyles } from '@masknet/theme'
import { MutationObserverWatcher } from '@dimensiondev/holoflows-kit'
import { createReactRootShadowed, startWatch, untilElementAvailable, MaskMessages } from '../../../utils/index.js'
import {
    searchAppBarBackSelector,
    searchNewTweetButtonSelector,
    searchProfileEmptySelector,
    searchProfileTabListLastChildSelector,
    searchProfileTabListSelector,
    searchProfileTabPageSelector,
    searchProfileTabSelector,
    searchProfileTabLoseConnectionPageSelector,
    searchNameTag,
} from '../utils/selector.js'
import { ProfileTab } from '../../../components/InjectedComponents/ProfileTab.js'

function getStyleProps() {
    const EMPTY_STYLE = {} as CSSStyleDeclaration
    const eleTab = searchProfileTabSelector().evaluate()?.querySelector('div') as Element
    const style = eleTab ? window.getComputedStyle(eleTab) : EMPTY_STYLE
    const eleNewTweetButton = searchNewTweetButtonSelector().evaluate()
    const newTweetButtonColorStyle = eleNewTweetButton ? window.getComputedStyle(eleNewTweetButton) : EMPTY_STYLE
    const eleBackButton = searchAppBarBackSelector().evaluate()
    const backButtonColorStyle = eleBackButton ? window.getComputedStyle(eleBackButton) : EMPTY_STYLE

    return {
        color: style.color,
        font: style.font,
        fontSize: style.fontSize,
        padding: style.paddingBottom,
        height: style.height,
        hover: backButtonColorStyle.color,
        line: newTweetButtonColorStyle.backgroundColor,
    }
}

const useStyles = makeStyles()((theme) => {
    const props = getStyleProps()

    return {
        root: {
            '&:hover': {
                backgroundColor: new Color(props.hover).alpha(0.1).toString(),
                cursor: 'pointer',
            },
            height: props.height,
        },
        button: {
            zIndex: 1,
            position: 'relative',
            display: 'flex',
            minWidth: 56,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: theme.spacing(0, props.padding),
            color: props.color,
            font: props.font,
            fontSize: props.fontSize,
            fontWeight: 500,
            '&:hover': {
                color: props.color,
            },
            height: props.height,
        },
        selected: {
            color: `${props.hover} !important`,
            fontWeight: 700,
        },
        line: {
            borderRadius: 9999,
            position: 'absolute',
            bottom: 0,
            minWidth: 56,
            alignSelf: 'center',
            height: 4,
            backgroundColor: props.line,
        },
    }
})

function nameTagClickHandler() {
    MaskMessages.events.profileTabUpdated.sendToLocal({ show: false })
    MaskMessages.events.profileTabActive.sendToLocal({ active: false })
    const nameTag = searchNameTag().evaluate()
    if (nameTag) nameTag.style.display = ''

    const eleEmpty = searchProfileEmptySelector().evaluate()
    if (eleEmpty) eleEmpty.style.display = 'none'

    const elePage = searchProfileTabPageSelector().evaluate()
    if (elePage) {
        elePage.style.visibility = 'hidden'
        elePage.style.height = 'auto'
    }
}

function tabClickHandler() {
    MaskMessages.events.profileTabUpdated.sendToLocal({ show: false })
    MaskMessages.events.profileTabActive.sendToLocal({ active: false })

    resetTwitterActivatedContent()
}

async function hideTwitterActivatedContent() {
    const eleTab = searchProfileTabSelector().evaluate()?.querySelector('div') as Element
    const loseConnectionEle = searchProfileTabLoseConnectionPageSelector().evaluate()
    if (!eleTab) return
    const style = window.getComputedStyle(eleTab)

    // hide the activated indicator
    const tabList = searchProfileTabListSelector().evaluate()
    tabList.map((v) => {
        const _v = v.querySelector('div') as HTMLDivElement
        _v.style.color = style.color
        const line = v.querySelector('div > div') as HTMLDivElement
        line.style.display = 'none'
        v.addEventListener('click', v.closest('#open-nft-button') ? nameTagClickHandler : tabClickHandler)
    })

    if (loseConnectionEle) return

    // hide the empty list indicator on the page
    const eleEmpty = searchProfileEmptySelector().evaluate()
    if (eleEmpty) eleEmpty.style.display = 'none'

    const nameTag = searchNameTag().evaluate()
    if (nameTag) nameTag.style.display = 'none'

    // hide the content page
    await untilElementAvailable(searchProfileTabPageSelector())

    const elePage = searchProfileTabPageSelector().evaluate()
    if (elePage) {
        elePage.style.visibility = 'hidden'
        elePage.style.height = 'auto'
    }
}

function resetTwitterActivatedContent() {
    const eleTab = searchProfileTabSelector().evaluate()?.querySelector('div') as Element
    const loseConnectionEle = searchProfileTabLoseConnectionPageSelector().evaluate()
    if (!eleTab) return

    const tabList = searchProfileTabListSelector().evaluate()
    tabList.map((v) => {
        const _v = v.querySelector('div') as HTMLDivElement
        _v.style.color = ''
        const line = v.querySelector('div > div') as HTMLDivElement
        line.style.display = ''
        v.removeEventListener('click', v.closest('#open-nft-button') ? nameTagClickHandler : tabClickHandler)
    })

    if (loseConnectionEle) return

    const eleEmpty = searchProfileEmptySelector().evaluate()
    if (eleEmpty) eleEmpty.style.display = ''

    const elePage = searchProfileTabPageSelector().evaluate()
    if (elePage) {
        elePage.style.visibility = 'visible'
        elePage.style.height = 'auto'
    }
}

export function ProfileTabAtTwitter() {
    const { classes } = useStyles()
    const [hidden, setHidden] = useState(false)
    useEffect(() => {
        return MaskMessages.events.profileTabHidden.on((data) => {
            setHidden(data.hidden)
        })
    }, [])

    return hidden ? null : (
        <ProfileTab
            title="Web3"
            classes={classes}
            reset={resetTwitterActivatedContent}
            clear={hideTwitterActivatedContent}
            children={<div className={classes.line} />}
        />
    )
}

export function injectProfileTabAtTwitter(signal: AbortSignal) {
    let tabInjected = false
    const contentWatcher = new MutationObserverWatcher(searchProfileTabPageSelector()).useForeach(() => {
        const elePage = searchProfileTabPageSelector().evaluate()
        if (elePage && !tabInjected) {
            const watcher = new MutationObserverWatcher(searchProfileTabListLastChildSelector())
            startWatch(watcher, signal)
            createReactRootShadowed(watcher.firstDOMProxy.afterShadow, { signal }).render(<ProfileTabAtTwitter />)
            tabInjected = true
        }
    })

    startWatch(contentWatcher, signal)
}
