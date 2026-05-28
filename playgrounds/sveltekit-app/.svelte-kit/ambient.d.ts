// this file is generated — do not edit it

/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 *
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 *
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 *
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 *
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 *
 * You can override `.env` values from the command line like so:
 *
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
  export const NODE_TLS_REJECT_UNAUTHORIZED: string
  export const NVM_INC: string
  export const NX_CLI_SET: string
  export const NX_LOAD_DOT_ENV_FILES: string
  export const npm_config_legacy_peer_deps: string
  export const TERM_PROGRAM: string
  export const NODE: string
  export const INIT_CWD: string
  export const GEMINI_CLI_IDE_WORKSPACE_PATH: string
  export const NVM_CD_FLAGS: string
  export const SHELL: string
  export const TERM: string
  export const HOMEBREW_REPOSITORY: string
  export const TMPDIR: string
  export const npm_config_global_prefix: string
  export const TERM_PROGRAM_VERSION: string
  export const VSCODE_PYTHON_AUTOACTIVATE_GUARD: string
  export const NX_CLOUD_LIGHT_CLIENT_RESOLUTION_PATHS: string
  export const MallocNanoZone: string
  export const ZDOTDIR: string
  export const COLOR: string
  export const npm_config_noproxy: string
  export const NX_TASK_TARGET_TARGET: string
  export const npm_config_local_prefix: string
  export const ENABLE_IDE_INTEGRATION: string
  export const PNPM_HOME: string
  export const ZSH: string
  export const NVM_DIR: string
  export const USER: string
  export const LS_COLORS: string
  export const COMMAND_MODE: string
  export const npm_config_globalconfig: string
  export const NX_TASK_HASH: string
  export const CLAUDE_CODE_SSE_PORT: string
  export const SSH_AUTH_SOCK: string
  export const VSCODE_PROFILE_INITIALIZED: string
  export const __CF_USER_TEXT_ENCODING: string
  export const npm_execpath: string
  export const PAGER: string
  export const LSCOLORS: string
  export const NX_TASK_TARGET_PROJECT: string
  export const PATH: string
  export const NX_INVOKED_BY_RUNNER: string
  export const npm_package_json: string
  export const LaunchInstanceID: string
  export const NX_WORKSPACE_ROOT: string
  export const _: string
  export const npm_config_userconfig: string
  export const npm_config_init_module: string
  export const USER_ZDOTDIR: string
  export const __CFBundleIdentifier: string
  export const npm_command: string
  export const NX_TUI: string
  export const PWD: string
  export const npm_lifecycle_event: string
  export const EDITOR: string
  export const npm_package_name: string
  export const LANG: string
  export const npm_config_npm_version: string
  export const NX_PSEUDO_TERMINAL_EXEC_ARGV: string
  export const NX_VERBOSE_LOGGING: string
  export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string
  export const XPC_FLAGS: string
  export const FORCE_COLOR: string
  export const npm_config_node_gyp: string
  export const GEMINI_CLI_IDE_AUTH_TOKEN: string
  export const npm_package_version: string
  export const XPC_SERVICE_NAME: string
  export const GEMINI_API_KEY: string
  export const VSCODE_INJECTION: string
  export const HOME: string
  export const SHLVL: string
  export const VSCODE_GIT_ASKPASS_MAIN: string
  export const HOMEBREW_PREFIX: string
  export const npm_config_cache: string
  export const LESS: string
  export const LOGNAME: string
  export const npm_lifecycle_script: string
  export const VSCODE_GIT_IPC_HANDLE: string
  export const GEMINI_CLI_IDE_SERVER_PORT: string
  export const LERNA_PACKAGE_NAME: string
  export const NVM_BIN: string
  export const npm_config_user_agent: string
  export const GIT_ASKPASS: string
  export const HOMEBREW_CELLAR: string
  export const INFOPATH: string
  export const VSCODE_GIT_ASKPASS_NODE: string
  export const COMPOSER_HOME: string
  export const SECURITYSESSIONID: string
  export const npm_node_execpath: string
  export const npm_config_prefix: string
  export const COLORTERM: string
  export const NODE_ENV: string
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 *
 * Values are replaced statically at build time.
 *
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 *
 * This module cannot be imported into client-side code.
 *
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 *
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
  export const env: {
    NODE_TLS_REJECT_UNAUTHORIZED: string
    NVM_INC: string
    NX_CLI_SET: string
    NX_LOAD_DOT_ENV_FILES: string
    npm_config_legacy_peer_deps: string
    TERM_PROGRAM: string
    NODE: string
    INIT_CWD: string
    GEMINI_CLI_IDE_WORKSPACE_PATH: string
    NVM_CD_FLAGS: string
    SHELL: string
    TERM: string
    HOMEBREW_REPOSITORY: string
    TMPDIR: string
    npm_config_global_prefix: string
    TERM_PROGRAM_VERSION: string
    VSCODE_PYTHON_AUTOACTIVATE_GUARD: string
    NX_CLOUD_LIGHT_CLIENT_RESOLUTION_PATHS: string
    MallocNanoZone: string
    ZDOTDIR: string
    COLOR: string
    npm_config_noproxy: string
    NX_TASK_TARGET_TARGET: string
    npm_config_local_prefix: string
    ENABLE_IDE_INTEGRATION: string
    PNPM_HOME: string
    ZSH: string
    NVM_DIR: string
    USER: string
    LS_COLORS: string
    COMMAND_MODE: string
    npm_config_globalconfig: string
    NX_TASK_HASH: string
    CLAUDE_CODE_SSE_PORT: string
    SSH_AUTH_SOCK: string
    VSCODE_PROFILE_INITIALIZED: string
    __CF_USER_TEXT_ENCODING: string
    npm_execpath: string
    PAGER: string
    LSCOLORS: string
    NX_TASK_TARGET_PROJECT: string
    PATH: string
    NX_INVOKED_BY_RUNNER: string
    npm_package_json: string
    LaunchInstanceID: string
    NX_WORKSPACE_ROOT: string
    _: string
    npm_config_userconfig: string
    npm_config_init_module: string
    USER_ZDOTDIR: string
    __CFBundleIdentifier: string
    npm_command: string
    NX_TUI: string
    PWD: string
    npm_lifecycle_event: string
    EDITOR: string
    npm_package_name: string
    LANG: string
    npm_config_npm_version: string
    NX_PSEUDO_TERMINAL_EXEC_ARGV: string
    NX_VERBOSE_LOGGING: string
    VSCODE_GIT_ASKPASS_EXTRA_ARGS: string
    XPC_FLAGS: string
    FORCE_COLOR: string
    npm_config_node_gyp: string
    GEMINI_CLI_IDE_AUTH_TOKEN: string
    npm_package_version: string
    XPC_SERVICE_NAME: string
    GEMINI_API_KEY: string
    VSCODE_INJECTION: string
    HOME: string
    SHLVL: string
    VSCODE_GIT_ASKPASS_MAIN: string
    HOMEBREW_PREFIX: string
    npm_config_cache: string
    LESS: string
    LOGNAME: string
    npm_lifecycle_script: string
    VSCODE_GIT_IPC_HANDLE: string
    GEMINI_CLI_IDE_SERVER_PORT: string
    LERNA_PACKAGE_NAME: string
    NVM_BIN: string
    npm_config_user_agent: string
    GIT_ASKPASS: string
    HOMEBREW_CELLAR: string
    INFOPATH: string
    VSCODE_GIT_ASKPASS_NODE: string
    COMPOSER_HOME: string
    SECURITYSESSIONID: string
    npm_node_execpath: string
    npm_config_prefix: string
    COLORTERM: string
    NODE_ENV: string
    [key: `PUBLIC_${string}`]: undefined
    [key: `${string}`]: string | undefined
  }
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 *
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 *
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
  export const env: {
    [key: `PUBLIC_${string}`]: string | undefined
  }
}
