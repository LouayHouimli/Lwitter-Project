const User = ({ user }) => {
  console.log(user);
  return (
    <div className="users">
      <div className="user" key={user._id}>
        <img src={user.profileImg} alt="" />
        <div className="info">
          <h2>{user.username}</h2>
        </div>
      </div>
    </div>
  );
};

export default User;
