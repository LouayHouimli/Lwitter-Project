import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import Axios from "axios";

const Settings = () => {
  const queryClient = useQueryClient();

  const {
    data: authUser,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await Axios.get("/api/auth/me");
      return res.data;
    },
    staleTime: 300000, 
  });

  const { mutate: updateTheme } = useMutation({
    mutationKey: ["updateTheme"],
    mutationFn: async (theme) => {
      const res = await Axios.post("/api/settings/updateTheme", { theme });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["authUser"]);
    },
  });

  const [theme, setTheme] = useState(authUser?.Settings.Appearance || "retro");

  const handleThemeChange = useCallback(
    (selectedTheme) => {
      setTheme(selectedTheme);
      updateTheme(selectedTheme);
    },
    [updateTheme]
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading settings</div>;
  }

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex flex-row gap-4 p-4 leading-none">
          <div className="mockup-browser bg-base-300 border w-full h-full select-none">
            <div className="mockup-browser-toolbar">
              <div className="input">
                https://lwitter.com/settings?{authUser.username}
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
                      <img src={authUser.profileImg} alt="Profile" />
                    </div>
                  </div>
                  <table className="table w-full gap-1 font-bold">
                    <tbody>
                      <tr>
                        <td>Username : </td>
                        <td
                          className="cursor-pointer"
                          onClick={() =>
                            navigator.clipboard.writeText(authUser.username)
                          }
                        >
                          @{authUser.username}
                        </td>
                      </tr>
                      <tr>
                        <td>Email : </td>
                        <td>{authUser.email}</td>
                      </tr>
                      <tr>
                        <td>Full Name : </td>
                        <td>{authUser.fullname}</td>
                      </tr>
                      <tr>
                        <td>Password : </td>
                        <td className="grow">*********</td>
                      </tr>
                    </tbody>
                  </table>
                </span>
              </div>

              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                className="tab"
                aria-label="Appearance"
              />
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 rounded-box p-6"
              >
                <div className="gap-4">
                  <span className="font-bold">Appearance : </span>
                  <div className="dropdown mb-72">
                    <div tabIndex={0} role="button" className="btn m-1">
                      Theme
                      <svg
                        width="12px"
                        height="12px"
                        className="inline-block h-2 w-2 fill-current opacity-60"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 2048 2048"
                      >
                        <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                      </svg>
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl"
                    >
                      <li>
                        <input
                          type="radio"
                          name="theme-dropdown"
                          className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                          aria-label="Retro"
                          value="retro"
                          onChange={(e) => handleThemeChange(e.target.value)}
                          checked={theme === "retro"}
                        />
                      </li>
                      <li>
                        <input
                          type="radio"
                          name="theme-dropdown"
                          className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                          aria-label="Dark"
                          value="dark"
                          onChange={(e) => handleThemeChange(e.target.value)}
                          checked={theme === "dark"}
                        />
                      </li>
                      <li>
                        <input
                          type="radio"
                          name="theme-dropdown"
                          className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                          aria-label="Synthwave"
                          value="synthwave"
                          onChange={(e) => handleThemeChange(e.target.value)}
                          checked={theme === "synthwave"}
                        />
                      </li>
                      <li>
                        <input
                          type="radio"
                          name="theme-dropdown"
                          className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                          aria-label="Valentine"
                          value="valentine"
                          onChange={(e) => handleThemeChange(e.target.value)}
                          checked={theme === "valentine"}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
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
