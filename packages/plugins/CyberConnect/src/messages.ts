import { createPluginMessage, createPluginRPC } from '@masknet/plugin-infra'
import { CYBERCONNECT_PLUGIN_ID } from './constants.js'

if (import.meta.webpackHot) import.meta.webpackHot.accept()
const PluginCyberConnectMessages = createPluginMessage(CYBERCONNECT_PLUGIN_ID)
export const PluginCyberConnectRPC = createPluginRPC(
    CYBERCONNECT_PLUGIN_ID,
    () => import('./Worker/apis/index.js'),
    PluginCyberConnectMessages.rpc,
)
