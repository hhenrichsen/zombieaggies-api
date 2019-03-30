const {Model,} = require('objection');

class Lore extends Model
{
    static get tableName()
    {
        return 'lore';
    }
}

module.exports = Lore;