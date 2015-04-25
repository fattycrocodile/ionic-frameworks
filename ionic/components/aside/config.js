import {ComponentConfig} from 'ionic/config/component-config'
import {Aside} from 'ionic/components/aside/aside';
import * as asideTypes from 'ionic/components/aside/types/types'
import * as asideGestures from  'ionic/components/aside/gestures/gestures';

export let AsideConfig = new ComponentConfig(Aside)

AsideConfig.classes('side', 'type')

AsideConfig.delegate('gesture')
  .when({side: 'left'}, gestures.LeftAsideGesture)
  .when({side: 'right'}, gestures.RightAsideGesture)
  .when({side: 'top'}, gestures.TopAsideGesture)
  .when({side: 'bottom'}, gestures.BottomAsideGesture)

AsideConfig.delegate('type')
  .when({type: 'overlay'}, types.AsideTypeOverlay)
  .when({type: 'push'}, types.AsideTypePush)
  .when({type: 'reveal'}, types.AsideTypeReveal)


AsideConfig.platform('android')
  .defaults({ type: 'overlay' })

AsideConfig.platform('ios')
  .defaults({ type: 'reveal' })
