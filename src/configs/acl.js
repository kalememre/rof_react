import { AbilityBuilder, Ability } from '@casl/ability'

export const AppAbility = Ability

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role, subject, ability) => {
  const { can, rules } = new AbilityBuilder(AppAbility)
  can(true, 'HomePage')
  if (Array.isArray(role)) {
    role.forEach(item => {
      item === 'ADMIN' ? can('manage', 'all') : can(true, item)
    })
  } else {
    role === 'ADMIN' ? can('manage', 'all') : can(true, role)
  }

  // if (role === 'admin') {
  //   can('manage', 'all')
  // } else if (role === 'client') {
  //   // create rules for each filtered ability
  //   ability.forEach(item => {
  //     can(true, item.ability.code)
  //   })
  // } else {
  //   can(['read', 'create', 'update', 'delete'], subject)
  // }

  return rules
}

export const buildAbilityFor = (role, subject, ability) => {
  return new AppAbility(defineRulesFor(role, subject, ability), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object.type
  })
}

export const defaultACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
