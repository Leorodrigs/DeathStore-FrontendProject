import { Link } from "react-router";
import { useAuth } from "../components/authContext";

export const Menu = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    onClose();
    window.location.href = "/";
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-black shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
            MENU
          </h2>
          <button
            onClick={onClose}
            className="text-white cursor-pointer hover:text-yellow-400 transition-colors duration-200"
            aria-label="Fechar menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center space-x-3">
            <div>
              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              {user?.isAdmin && (
                <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded-full mt-1">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6">
          <div className="space-y-2 px-4">
            <Link
              to="/me"
              onClick={onClose}
              className="flex items-center space-x-3 w-full p-3 text-white hover:bg-gray-800 rounded-lg transition-all duration-200 group"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-medium">Meu Perfil</span>
            </Link>

            <Link
              to="/home?category=armas"
              onClick={onClose}
              className="flex items-center space-x-3 w-full p-3 text-white hover:bg-gray-800 rounded-lg transition-all duration-200 group"
            >
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-yellow-400"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
                stroke="#000000"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    fill="#ffffff"
                    d="M478.89 21.842c-6.434-.113-15.047 3.628-24.242 12.822L328.912 160.4c0-.007.003-.015.004-.023l-60.228 60.228.01.01-12.727 12.727-.01-.01-22.657 22.658.01.01-12.44 12.44-.01-.01-30.884 30.884c0 .005.002.01.004.014l-55.656 55.656 22.627 22.627 320.32-320.32c18.827-18.825 14.79-35.217 1.616-35.448zm-445.84.06c-13.176.232-17.213 16.623 1.614 35.45l185.912 185.912 22.658-22.66-44.164-44.16c0 .02 0 .038-.002.058L57.29 34.725C48.098 25.53 39.484 21.79 33.05 21.902zm234.538 36.39c-9.308 42.14-12.624 79.314-27.922 121.454-21.636-16.89-30.623-41.47-43.836-63.414.586 10.88 1.66 22.256 2.42 33.838l57.71 57.71 78.485-78.485a2474.362 2474.362 0 0 1 4.078-21.237c-21.27 28.796-42.452 44.68-71.396 73.475-6.752-45.418.278-77.923.46-123.34zM87.873 170.623c-.052.003-.08.017-.082.044-.258 5.25 104.427 78.357 96.222 83.578-13.465 8.55-57.975 31.11-83.508 44.914 19.72-3.345 53.538-7.933 72.18-8.002l35.453-35.453-63.655-63.652c-27.027-10.216-54.915-21.568-56.61-21.43zm245.143 56.144l-29.086 29.086 56.174 56.17c10.848.735 21.692 1.416 32.5 1.218-24.518-15.9-71.99-43.734-71.64-50.568.353-6.887 63.447-21.216 95.518-31.606-27.787-2.137-55.973 3.846-83.466-4.3zm-41.813 41.812l-22.656 22.656 86.437 86.438 22.627-22.627-44.473-44.475h.06l-41.994-41.992zm-35.098 35.098l-57.703 57.703c.408 14.207.21 28.454-.52 40.38 11.322-26.84 17.846-51.86 45.827-74.473 14.444 11.985 24.816 40.267 37.224 60.4-.91-19.042-6.873-52.002-5.03-64.214l-19.8-19.797zM111.7 354.984L98.974 367.71l45.256 45.257 12.725-12.73-45.252-45.253h-.002zm288.538.06l-45.254 45.253v.002l12.727 12.727 45.257-45.256-12.73-12.725zM94.023 385.39l-9.9 9.9 32.527 32.526 9.9-9.9-32.527-32.527zm323.893.06l-32.527 32.527 9.9 9.9 32.526-32.527-9.9-9.9zm-346.52 22.568L21.9 457.512l32.528 32.527 10.603-10.604 10.73 10.726 17.847-17.848-10.728-10.726 21.042-21.043-9.9-9.9-38.89 38.89-12.728-12.728 38.89-38.89-9.9-9.9zm369.15.06l-9.9 9.9 38.89 38.89-12.73 12.728-38.89-38.89-9.898 9.9 49.494 49.494 32.527-32.528-10.604-10.603 10.726-10.73-17.848-17.847-10.726 10.728-21.043-21.042z"
                  ></path>
                </g>
              </svg>
              <span className="font-medium">Armas</span>
            </Link>

            <Link
              to="/home?category=naves"
              onClick={onClose}
              className="flex items-center space-x-3 w-full p-3 text-white hover:bg-gray-800 rounded-lg transition-all duration-200 group"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="#ffffff"
                height="200px"
                width="200px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
                xml:space="preserve"
                stroke="#ffffff"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g transform="translate(1)">
                    {" "}
                    <g>
                      {" "}
                      <g>
                        {" "}
                        <path d="M135.96,358.4c-5.12,0-8.533,3.413-8.533,8.533s3.413,8.533,8.533,8.533s8.533-3.413,8.533-8.533 S141.08,358.4,135.96,358.4z"></path>{" "}
                        <path d="M135.96,392.533c-5.12,0-8.533,3.413-8.533,8.533c0,5.12,3.413,8.533,8.533,8.533s8.533-3.413,8.533-8.533 C144.493,395.947,141.08,392.533,135.96,392.533z"></path>{" "}
                        <path d="M135.96,426.667c-5.12,0-8.533,3.413-8.533,8.533s3.413,8.533,8.533,8.533s8.533-3.413,8.533-8.533 S141.08,426.667,135.96,426.667z"></path>{" "}
                        <path d="M255.427,238.933c-5.12,0-8.533,3.413-8.533,8.533s3.413,8.533,8.533,8.533s8.533-3.413,8.533-8.533 S260.547,238.933,255.427,238.933z"></path>{" "}
                        <path d="M255.427,273.067c-5.12,0-8.533,3.413-8.533,8.533s3.413,8.533,8.533,8.533s8.533-3.413,8.533-8.533 S260.547,273.067,255.427,273.067z"></path>{" "}
                        <path d="M255.427,307.2c-5.12,0-8.533,3.413-8.533,8.533s3.413,8.533,8.533,8.533s8.533-3.413,8.533-8.533 S260.547,307.2,255.427,307.2z"></path>{" "}
                        <path d="M374.893,358.4c-5.12,0-8.533,3.413-8.533,8.533s3.413,8.533,8.533,8.533s8.533-3.413,8.533-8.533 S380.013,358.4,374.893,358.4z"></path>{" "}
                        <path d="M374.893,392.533c-5.12,0-8.533,3.413-8.533,8.533c0,5.12,3.413,8.533,8.533,8.533s8.533-3.413,8.533-8.533 C383.427,395.947,380.013,392.533,374.893,392.533z"></path>{" "}
                        <path d="M374.893,426.667c-5.12,0-8.533,3.413-8.533,8.533s3.413,8.533,8.533,8.533s8.533-3.413,8.533-8.533 S380.013,426.667,374.893,426.667z"></path>{" "}
                        <path d="M507.16,367.787l-0.853-1.707C381.72,171.52,303.213,46.933,296.387,33.28C281.027,0.853,260.547,0,255.427,0 s-25.6,0.853-40.96,33.28C205.933,48.64,100.12,215.893,2.84,368.64c-2.56,3.413-3.413,6.827-3.413,11.093v65.707 c0,5.973,2.56,11.947,7.68,16.213c4.267,3.413,8.533,5.12,13.653,5.12c1.707,0,2.56-0.853,4.267-0.853l76.8-15.36v10.24 c0,9.387,7.68,17.067,17.067,17.067h8.533v25.6c0,5.12,3.413,8.533,8.533,8.533s8.533-3.413,8.533-8.533v-25.6h8.533 c9.387,0,17.067-7.68,17.067-17.067v-24.796l26.773-5.432l-0.32,6.335c-0.853,6.827,1.707,12.8,5.973,17.067 s10.24,6.827,16.213,6.827h28.16v42.667c0,5.12,3.413,8.533,8.533,8.533s8.533-3.413,8.533-8.533V460.8h28.16 c5.973,0,11.947-2.56,16.213-6.827s5.973-10.24,5.973-16.213l-0.428-8.484l26.881,6.233V460.8c0,9.387,7.68,17.067,17.067,17.067 h8.533v25.6c0,5.12,3.413,8.533,8.533,8.533s8.533-3.413,8.533-8.533v-25.6h8.533c9.387,0,17.067-7.68,17.067-17.067v-12.529 l75.947,16.796c6.827,1.707,12.8,0,17.92-4.267c5.12-3.413,7.68-9.387,7.68-16.213V378.88 C510.573,375.467,509.72,371.2,507.16,367.787z M135.576,290.153c2.306,0.048,4.438,0.436,6.391,1.099 c0.193,0.073,0.392,0.134,0.582,0.214c0.017,0.006,0.033,0.013,0.05,0.02c6.113,2.603,10.428,8.679,10.428,15.714v17.067h-34.133 v-15.36c0-10.064,7.421-17.639,15.776-18.708C134.97,290.176,135.272,290.16,135.576,290.153z M153.027,460.8h-34.133v-13.653 V341.333h34.133v98.133V460.8z M269.08,110.933l11.947,11.947l2.56,47.787H263.96v-59.733H269.08z M246.893,170.667h-19.527 l2.461-47.787l11.947-11.947h5.12V170.667z M297.24,442.027c-1.707,0.853-2.56,1.707-4.267,1.707H263.96v-68.267 c0-5.12-3.413-8.533-8.533-8.533s-8.533,3.413-8.533,8.533v68.267h-27.307c-1.707,0-3.413-0.853-4.267-1.707 c-0.853-1.707-1.707-2.56-1.707-4.267l12.874-250.027h58.23l14.229,250.027C298.947,439.467,298.093,441.173,297.24,442.027z M374.617,290.147c4.143,0.144,8.924,1.807,11.37,4.253c3.413,3.413,5.12,7.68,5.12,12.8l0.632,17.067h-33.912v-15.36 c0-10.064,7.421-17.639,15.776-18.708C373.939,290.174,374.276,290.153,374.617,290.147z M357.827,460.8v-21.333v-98.133h34.133 V460.8H357.827z M494.36,444.587c0,1.707-0.853,2.56-1.707,3.413c-0.853,0.853-1.707,0.853-3.413,0.853l-80.213-16.213V307.2 c0-9.387-3.413-17.92-10.24-24.747s-16.213-10.24-25.6-9.387c-2.264,0.108-4.473,0.462-6.605,1.035 c-14.79,3.737-25.821,17.19-25.821,33.099v1.707v109.227l-27.307-5.12l-15.36-296.96l-22.187-22.187h-40.96l-22.187,22.187 L197.4,412.16l-27.307,5.973V307.2c0-9.387-3.413-17.92-10.24-24.747s-16.213-10.24-25.6-9.387 c-2.264,0.108-4.473,0.462-6.605,1.035c-14.79,3.737-25.821,17.19-25.821,33.099v1.707V432.64l-80.213,16.213 c-1.707,0-2.56,0-3.413-0.853s-1.707-1.707-1.707-3.413V378.88c0-0.853,0-0.853,0.853-2.56 C77.933,282.453,218.733,60.587,228.973,40.96c11.947-23.04,23.893-23.893,24.747-23.893h0.64h1.067h0.853 c0.853,0,13.653,0,25.6,23.893c9.387,19.627,151.04,240.64,210.773,334.507l0.853,0.853c0.853,0.853,0.853,1.707,0.853,2.56 V444.587z"></path>{" "}
                      </g>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>
              </svg>
              <span className="font-medium">Naves</span>
            </Link>

            <Link
              to="/home?category=robos"
              onClick={onClose}
              className="flex items-center space-x-3 w-full p-3 text-white hover:bg-gray-800 rounded-lg transition-all duration-200 group"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect
                  x="3"
                  y="8"
                  width="18"
                  height="12"
                  rx="2"
                  strokeWidth={2}
                />
                <circle cx="8" cy="12" r="1" />
                <circle cx="16" cy="12" r="1" />
                <path d="M9 16h6" strokeWidth={2} strokeLinecap="round" />
                <path
                  d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <path d="M6 8V6" strokeWidth={2} strokeLinecap="round" />
                <path d="M18 8V6" strokeWidth={2} strokeLinecap="round" />
              </svg>
              <span className="font-medium">Robôs</span>
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-3 text-white cursor-pointer hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200 group"
          >
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
};
