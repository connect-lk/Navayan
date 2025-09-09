import React from "react";
const tableData = [
  { sn: 1, unitNo: 'S1', plotSize: '1500 sq.ft.', plotFacing: 'North', plc: 'Garden', cost: '₹ 7,50,000', addCost: '₹ 50,000', status: 'Available', booked: false },
  { sn: 1, unitNo: 'S1', plotSize: '1500 sq.ft.', plotFacing: 'North', plc: 'Garden', cost: '₹ 7,50,000', addCost: '₹ 50,000', status: 'Available', booked: false },
  { sn: 2, unitNo: 'S2', plotSize: '1000 sq.ft.', plotFacing: 'East', plc: 'Corner', cost: '₹ 5,00,000', addCost: '₹ 50,000', status: 'Booked', booked: true },
  { sn: 2, unitNo: 'S2', plotSize: '1000 sq.ft.', plotFacing: 'East', plc: 'Corner', cost: '₹ 5,00,000', addCost: '₹ 50,000', status: 'Booked', booked: true },
  { sn: 2, unitNo: 'S2', plotSize: '1000 sq.ft.', plotFacing: 'East', plc: 'Corner', cost: '₹ 5,00,000', addCost: '₹ 50,000', status: 'Booked', booked: true },
  { sn: 2, unitNo: 'S2', plotSize: '1000 sq.ft.', plotFacing: 'East', plc: 'Corner', cost: '₹ 5,00,000', addCost: '₹ 50,000', status: 'Booked', booked: true },
  { sn: 1, unitNo: 'S1', plotSize: '1500 sq.ft.', plotFacing: 'North', plc: 'Garden', cost: '₹ 7,50,000', addCost: '₹ 50,000', status: 'Available', booked: false },
  { sn: 2, unitNo: 'S2', plotSize: '1000 sq.ft.', plotFacing: 'East', plc: 'Corner', cost: '₹ 5,00,000', addCost: '₹ 50,000', status: 'Booked', booked: true },
  { sn: 2, unitNo: 'S2', plotSize: '1000 sq.ft.', plotFacing: 'East', plc: 'Corner', cost: '₹ 5,00,000', addCost: '₹ 50,000', status: 'Booked', booked: true },
  { sn: 1, unitNo: 'S1', plotSize: '1500 sq.ft.', plotFacing: 'North', plc: 'Garden', cost: '₹ 7,50,000', addCost: '₹ 50,000', status: 'Available', booked: false },
  { sn: 1, unitNo: 'S1', plotSize: '1500 sq.ft.', plotFacing: 'North', plc: 'Garden', cost: '₹ 7,50,000', addCost: '₹ 50,000', status: 'Available', booked: false },
];
const InventoryTable = () => {
  return (
    <div className="bg-white rounded-lg  shadow-xl  min-h-auto">
      <div className="rounded-lg overflow-hidden bg-gray-100 p-2">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-100 text-[#6B7280] text-sm md:text-base">
                <th className="font-semibold p-4 text-center rounded-l-lg">
                  SN.
                </th>
                <th className="font-semibold p-4 text-center">UNIT NO.</th>
                <th className="font-semibold p-4 text-center">PLOT SIZE</th>
                <th className="font-semibold p-4 text-center">PLOT FACING</th>
                <th className="font-semibold p-4 text-center">PLC</th>
                <th className="font-semibold p-4 text-center">COST</th>
                <th className="font-semibold p-4 text-center">ADD COST</th>
                <th className="font-semibold p-4 text-center">STATUS</th>
                <th className="font-semibold p-4 text-center rounded-r-lg">
                  BOOK
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableData.map((row, index) => (
                <tr
                  key={index}
                  className="bg-white hover:bg-gray-50 transition-colors duration-200 text-sm md:text-base"
                >
                  <td className="p-4 text-center rounded-l-lg">{row.sn}</td>
                  <td className="p-4 text-center">{row.unitNo}</td>
                  <td className="p-4 text-center">{row.plotSize}</td>
                  <td className="p-4 text-center">{row.plotFacing}</td>
                  <td className="p-4 text-center">{row.plc}</td>
                  <td className="p-4 text-center">{row.cost}</td>
                  <td className="p-4 text-center">{row.addCost}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-1 rounded-sm text-xs font-semibold ${
                        row.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-center rounded-r-lg">
                    <button
                      className={`font-semibold px-4 py-2 text-sm rounded-md cursor-pointer transition-all duration-300 ${
                        row.booked
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-[#066fa9] text-white "
                      }`}
                      disabled={row.booked}
                    >
                      {row.booked ? "Booked" : "Book Now"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
