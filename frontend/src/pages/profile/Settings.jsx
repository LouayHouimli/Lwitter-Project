import {useQuery} from "@tanstack/react-query";

const Settings = () => {

  const authUser = useQuery({ queryKey: ["authUser"] });
  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex flex-row gap-4 p-4 leading-none">
          <div className="mockup-browser bg-base-300 border w-full h-full select-none">
            <div className="mockup-browser-toolbar">
              <div className="input">
                https://lwitter.com/settings?{authUser.data.username}
              </div>
            </div>
            <div role="tablist" className="tabs tabs-lifted">
              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                className="tab"
                aria-label="Information"
                defaultChecked
              />
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-3"
              >
                <span className="flex flex-col gap-4 justify-center items-center">
                  <div className="avatar">
                    <div className="mask mask-hexagon w-24">
                      <img src={authUser.data.profileImg} />
                    </div>
                  </div>
                  <table className="table w-full gap-1 font-bold">
                    <tr>
                      <td>Username : </td>
                      <td className="cursor-pointer" onClick={() => navigator.clipboard.writeText(authUser.data.username)}>@{authUser.data.username}</td>
                    </tr>
                    <tr>
                      <td>Email : </td>
                      <td>{authUser.data.email}</td>
                    </tr>
                    <tr>
                      <td>Full Name : </td>
                      <td>{authUser.data.fullname}</td>
                    </tr>
                    <tr>
                      <td>Password : </td>
                      <td className="grow">
  
                      </td>
                    </tr>
                  </table>
                </span>
              </div>

              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                className="tab"
                aria-label="Tab 2"
              />
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-6"
              >
                Tab content 2
              </div>

              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                className="tab"
                aria-label="Tab 3"
              />
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-6"
              >
                Tab content 3
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Settings;
