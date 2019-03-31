"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
class ZCommand extends command_1.Command {
    static hasHuman(message, config) {
        if (config.getRoles().humanRole)
            return message.member.roles.some(role => role === config.getRoles().humanRole);
        command_1.Command.missingRole(message, config, 'Human');
        return false;
    }
    static hasZombie(message, config) {
        if (config.getRoles().zombieRole)
            return message.member.roles.some(role => role === config.getRoles().zombieRole);
        command_1.Command.missingRole(message, config, 'Zombie');
        return false;
    }
    static hasAdmin(message, config) {
        if (config.getRoles().adminRole)
            return message.member.roles.some(role => role === config.getRoles().adminRole);
        command_1.Command.missingRole(message, config, 'Admin');
        return false;
    }
    static hasLancelot(message, config) {
        if (config.getRoles().lancelotRole)
            return message.member.roles.some(role => role === config.getRoles().lancelotRole);
        return false;
    }
}
exports.ZCommand = ZCommand;
//# sourceMappingURL=zcommand.js.map