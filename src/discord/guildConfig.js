"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GuildConfig {
    /**
     *
     * @param {Guild} guild The guild to attach to this config.
     * @param {RoleList} roles An optional list of roles to use for this server.
     * @param {FeatureConfig} config An optional list of on-off toggles for features.
     * @param {string} prefix Optional command prefix.
     */
    constructor(guild, roles, config, prefix) {
        this.id = guild.id;
        this.guild = guild;
        this.roles = Object.assign({}, this.findRoles(), roles);
        this.config = Object.assign({}, GuildConfig.defaultConfig, config);
        this.prefix = prefix || '!';
    }
    /**
     * Searches for a role with the provided name.
     * @param name Name of the role.
     */
    findRole(name) {
        return this.guild.roles.find(role => role.name === name);
    }
    /**
     * Fetches roles that are already set up and created.
     * @returns {RoleList} A list of the found roles.
     */
    findRoles() {
        return {
            humanRole: this.findRole("Human"),
            zombieRole: this.findRole("Zombie"),
            lancelotRole: this.findRole("Lancelot"),
            adminRole: this.findRole("Admin")
        };
    }
    /**
     * Get the ID of the attached guild.
     * @returns {Snowflake} ID of the attached guild.
     */
    getId() {
        return this.id;
    }
    /**
     * Get the attached guild.
     * @returns {Guild} The attached guild.
     */
    getGuild() {
        return this.guild;
    }
    /**
     * Returns a RoleList of the attached roles.
     * @returns {RoleList} The attached roles.
     */
    getRoles() {
        return this.roles;
    }
    /**
     * Returns a FeatureConfig for the server.
     * @returns {FeatureConfig} The features configuration.
     */
    getConfig() {
        return this.config;
    }
    getPrefix() {
        return this.prefix;
    }
}
GuildConfig.defaultConfig = {
    enableSwitching: true,
    enableJoinMessage: false,
    //        enableWebCrawl: false,
    //        enableWebNotify: false,
    //        enableWebSwitch: false, 
    enableLancelot: false,
    enableAllLancelot: false,
};
exports.GuildConfig = GuildConfig;
//# sourceMappingURL=guildConfig.js.map