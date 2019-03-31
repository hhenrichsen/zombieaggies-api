import {Guild, Snowflake, Role} from "discord.js";

/**
 * @typedef {Object} FeatureConfig
 * @property {boolean} [enableSwitching] Enables or disables switching. Default: enabled.
 * @property {boolean} [enableJoinMessage] Enables the DM message for new users. Default: disabled.
 * @property {boolean} [enableLancelot] Enables the lancelot role. Default: disabled.
 * @property {boolean} [enableAllLancelot] Allows every role to use the lancelot feature. Default: off.
 */

export interface FeatureConfig {
    enableSwitching?: boolean,
    enableJoinMessage?: boolean,
    enableLancelot?: boolean,
    enableAllLancelot?: boolean,
}

/*
 * Disabled properties temporarily:
 * @property {boolean} [enableWebCrawl] Enables web crawling. Default: disabled.
 * @property {boolean} [enableWebNotify] Enables notifications for web events. Default: disabled.
 * @property {boolean} [enableWebSwitch] Enables switching based on web events. Default: disabled.
 */

/**
 * @typedef {Object} RoleList
 * @property {Role} [humanRole] Human role.
 * @property {Role} [zombieRole] Zombie role.
 * @property {Role} [adminRole] Role that can change others' roles and start/stop a game.
 * @property {Role} [lancelotRole] Optional role. Allows swapping from a Zombie back to a Human.
 */

export interface RoleList {
    humanRole?: Role,
    zombieRole?: Role,
    adminRole?: Role,
    lancelotRole?: Role,
}

export class GuildConfig {
    static defaultConfig = {
        enableSwitching: true,
        enableJoinMessage: false,
//        enableWebCrawl: false,
//        enableWebNotify: false,
//        enableWebSwitch: false, 
        enableLancelot: false,
        enableAllLancelot: false,
    };

    private id: Snowflake;
    private guild: Guild;
    private roles: RoleList;
    private config: FeatureConfig;
    private prefix: string;

    /**
     *
     * @param {Guild} guild The guild to attach to this config.
     * @param {RoleList} roles An optional list of roles to use for this server.
     * @param {FeatureConfig} config An optional list of on-off toggles for features.
     * @param {string} prefix Optional command prefix.
     */
    constructor(guild: Guild, roles?: RoleList, config?: FeatureConfig, prefix?: string) {
        this.id = guild.id;
        this.guild = guild;
        this.roles = Object.assign({}, this.findRoles(), roles);
        this.config = Object.assign({}, GuildConfig.defaultConfig, config);
        this.prefix = prefix || '!';
    }

    /**
     * Get the ID of the attached guild.
     * @returns {Snowflake} ID of the attached guild.
     */
    public getId(): Snowflake {
        return this.id;
    }

    /**
     * Get the attached guild.
     * @returns {Guild} The attached guild.
     */
    public getGuild(): Guild {
        return this.guild;
    }

    /**
     * Returns a RoleList of the attached roles.
     * @returns {RoleList} The attached roles.
     */
    public getRoles(): RoleList {
        return this.roles;
    }

    /**
     * Returns a FeatureConfig for the server.
     * @returns {FeatureConfig} The features configuration.
     */
    public getConfig(): FeatureConfig {
        return this.config;
    }

    public getPrefix(): string {
        return this.prefix;
    }

    /**
     * Searches for a role with the provided name.
     * @param name Name of the role.
     */
    private findRole(name: string): Role {
        return this.guild.roles.find(role => role.name === name);
    }

    /**
     * Fetches roles that are already set up and created.
     * @returns {RoleList} A list of the found roles.
     */
    private findRoles(): RoleList {
        return {
            humanRole: this.findRole("Human"),
            zombieRole: this.findRole("Zombie"),
            lancelotRole: this.findRole("Lancelot"),
            adminRole: this.findRole("Admin")
        };
    }
}