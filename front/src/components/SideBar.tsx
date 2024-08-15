export const SideBar = () => {
  return (
    <div className="p-2 w-[250px] border-r border-[#ffffff23] overflow-y-auto text-center">
      <div className="text-gray-100 text-xl">
        <div className="p-2.5 mt-1 flex items-center">
          <i className="px-2 py-1 rounded-md bg-blue-600"></i>
          <h1 className="font-bold text-gray-200 text-[15px] ml-3">Sidebar</h1>
          <i
            className="bi bi-x cursor-pointer ml-28 lg:hidden"
            // onclick="openSidebar()"
          ></i>
        </div>
        <div className="my-2 bg-gray-600 h-[1px]"></div>
      </div>
      <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
        <span className="text-[15px] ml-4 text-gray-200 font-bold">Home</span>
      </div>
      <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
        <span className="text-[15px] ml-4 text-gray-200 font-bold">Chats</span>
      </div>
      <div className="my-4 bg-gray-600 h-[1px]"></div>
      <div
        className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
        // onclick="dropdown()"
      >
        <div className="flex justify-between w-full items-center">
          <span className="text-[15px] ml-4 text-gray-200 font-bold">
            Tickets
          </span>
          {/* <span className="text-sm rotate-180" id="arrow">
            <i className="bi bi-chevron-down"></i>
          </span> */}
        </div>
      </div>
      <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-[#f33939] text-white">
        <i className="bi bi-box-arrow-in-right"></i>
        <span className="text-[15px] ml-4 text-gray-200 font-bold">Logout</span>
      </div>
    </div>
  );
};
