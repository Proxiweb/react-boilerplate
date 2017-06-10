/**
* generate redux constants for saga managed api
* @domain @string domain of the app (ex: 'app/Homepage')
* @scope @string scope of the action (ex: 'load_profile')
**/
export default function generateConstants(domain, scope) {
  const constants = {};
  const states = ["START", "SUCCESS", "ERROR"];
  states.forEach(state => {
    constants[`ASYNC_${scope.toUpperCase()}_${state}`] = `${domain}/ASYNC_${scope.toUpperCase()}_${state}`;
  });

  return constants;
}

/**
* finds constant with state SUCCESS
* @constants obj
**/
export const findActionType = (scope, constants, type) =>
  constants[
    Object.keys(constants).find(key =>
      constants[key].match(new RegExp(`\\w+${scope.toUpperCase()}_${type.toUpperCase()}`))
    )
  ];
