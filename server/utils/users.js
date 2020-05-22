
class Users {
    constructor () {
        this.users = [];
    }
    addUser(id,name,room)
    {
        var user = {id,name,room};
        this.users.push(user);
        return user;
    }
    removeUser(id)
    {
        var user = this.getUser(id);

        if(user)                  //
        {
            this.users = this.users.filter( (us) => {
                return us.id != id;
            })
        }

        return user;
    }

    getUser(id)
    {
        var us = this.users.filter( (us) => {
           return us.id === id;
        });
        return us[0];                 //
    }

    getUserList (room) {
        var users = this.users.filter( (user) => {
            return room === user.room;
        })

        var nameArray = users.map ( (user) => {
            return user.name;
        });
        return nameArray;
    }

}

module.exports = {
    Users: Users
};