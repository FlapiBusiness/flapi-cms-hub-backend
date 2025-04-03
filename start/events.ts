import emitter from '@adonisjs/core/services/emitter'
import SignInEvent from '#events/signin_event'
import SignUpEvent from '#events/signup_event'
import SignOutEvent from '#events/signout_event'
const ApplicationEventLogListener = () => import('#listeners/application_event_log_listener')

emitter.listen(SignInEvent, [ApplicationEventLogListener])
emitter.listen(SignUpEvent, [ApplicationEventLogListener])
emitter.listen(SignOutEvent, [ApplicationEventLogListener])
