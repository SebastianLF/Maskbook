import { PluginID } from '@masknet/shared-base'
import FindTrumanConstPromise from './SNSAdaptor/ConstPromise.js'

export const FIND_TRUMAN_PLUGIN_NAME = 'FindTruman'
export const FIND_TRUMAN_PLUGIN_ID = PluginID.FindTruman

export const FindTruman_Const: FindTrumanConstPromise = new FindTrumanConstPromise()
