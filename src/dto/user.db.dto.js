// user.db.dto.js
const mapUserToDTO = (user) => {
    return {
        name: `${user.first_name} ${user.last_name}`,
        username: user.username,
        role: user.role,
    };
};

module.exports = {
    mapUserToDTO,
};
