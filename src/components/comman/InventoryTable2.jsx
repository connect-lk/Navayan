"use client";

import React, { memo, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import {
  MaterialReactTable,
  useMaterialReactTable,
  createMRTColumnHelper,
} from "material-react-table";

const InventoryTable2 = memo(
  ({
    kycTable,
    tableData,
    slug,
    holdFlatFun,
    loading,
    searchText,
    setSearchText,
  }) => {
    const router = useRouter();
    const [loadingRow, setLoadingRow] = useState(null);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
      const interval = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
      const s = (seconds % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    };

    const getRemainingTime = (expiresAt) => {
      if (!expiresAt) return 0;
      const expiry = new Date(expiresAt.replace(" ", "T")).getTime();
      const diff = Math.round((expiry - Date.now()) / 1000);
      return diff > 0 ? diff : 0;
    };

    useEffect(() => {
      const interval = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(interval);
    }, []);

    const getAadhaarDetails = async (session_id) => {
      const access_token = localStorage.getItem("accessToken");
      const res = await fetch(
        `/api/digilocker_issued_doc?session_id=${session_id}&access_token=${access_token}`
      );
      const digilocker_issued_docData = await res.json();
      console.log("Aadhaar document:", digilocker_issued_docData);

      const responsess = await fetch("/api/xml_to_text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: digilocker_issued_docData?.pan?.data?.files[0].url,
        }),
      });

      const datass = await responsess.json();
      const panKyc = datass?.data?.Certificate?.CertificateData?.PAN;

      const response = await fetch("/api/xml_to_text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: digilocker_issued_docData?.aadhaar?.data?.files[0].url,
        }),
      });

      const data = await response.json();
      const aadhaarKyc = data?.data?.Certificate?.CertificateData.KycRes;

      const userInfo = {
        uid: aadhaarKyc?.UidData?.$?.uid,
        name: aadhaarKyc?.UidData?.Poi?.$?.name,
        dob: aadhaarKyc?.UidData?.Poi?.$?.dob,
        gender: aadhaarKyc?.UidData?.Poi?.$?.gender,
        addressEnglish: aadhaarKyc?.UidData?.Poa?.$,
        addressLocal: aadhaarKyc?.UidData?.LData?.$,
        photo: aadhaarKyc?.UidData?.Pht,
        panNum: panKyc?.$?.num,
      };

      console.log(userInfo);
      return userInfo;
    };

    const handleBookNow = useCallback(async (id) => {
      localStorage.setItem("booking_id", id);
      const session_id = localStorage.getItem("session_id");
      const access_token = localStorage.getItem("accessToken");
      setLoadingRow(id);
      let statusData;
      if (session_id && access_token) {
        const statusRes = await fetch(
          `/api/digilocker_status?session_id=${session_id}&access_token=${access_token}`
        );

        statusData = await statusRes.json();
        console.log("Session Status:", statusData);
        const createdAt = statusData?.data?.created_at;
        const updatedAt = statusData?.data?.updated_at;
      }

      if (
        statusData?.sessionExpired ||
        !session_id ||
        statusData?.code == 521 ||
        statusData?.code == 403
      ) {
        const res = await fetch("/api/digilocker", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
          }),
        });

        const data = await res.json();
        console.log("API Response:", data);

        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          await holdFlatFun(id);
        }

        if (data.digiData?.data?.authorization_url) {
          window.location.href = data.digiData.data.authorization_url;
        } else {
          setLoadingRow(null);
          console.error("No authorization URL found", data);
        }
      } else {
        getAadhaarDetails(session_id).then(async (Details) => {
          await holdFlatFun(id);
          setLoadingRow(id);

          localStorage.setItem("kyc_Details", JSON.stringify(Details));
          const bokking_id = localStorage.getItem("booking_id");
          router.push(`/properties/${slug}/bookingproperties/${id}`);
        });
      }
    });

    // const handleBookNow = useCallback(
    //   async (id) => {
    //     localStorage.setItem("booking_id", id);
    //     setLoadingRow(id);
    //     // ➝ keep your same booking + KYC logic here
    //     await holdFlatFun(id);
    //     setLoadingRow(null);
    //     router.push(`/properties/${slug}/bookingproperties/${id}`);
    //   },
    //   [holdFlatFun, router, slug]
    // );

    const columnHelper = createMRTColumnHelper();
    const columns = [
      columnHelper.accessor("plotNo", {
        header: "PLOT NO.",
        size: 80,
        enableColumnActions: false,
        enableSorting: false,
        enableHiding: false,
        muiTableHeadCellProps: {
          sx: {
            position: "sticky",
            left: 0,
            zIndex: 2,
            background: "#f9fafb",
            paddingTop: "20px",
            paddingBottom: "18px",
            fontFamily: "Inter",
            fontWeight: 600,
            color: "#6B7280",
          },
        },
        muiTableBodyCellProps: {
          sx: {
            position: "sticky",
            left: 0,
            zIndex: 1,
            background: "white",
            fontWeight: 500,
          },
        },
        Cell: ({ cell }) => (
          <span className="pl-4  py-2 text-[16px] Inter text-gray-700 font-medium">
            {cell.getValue() || "Not Data"}
          </span>
        ),
      }),

      columnHelper.accessor("plotSize", {
        header: "PLOT SIZE",
        muiTableHeadCellProps: {
          sx: {
            textAlign: "center",
            paddingTop: "20px",
            paddingBottom: "18px",
            fontFamily: "Inter",
            color: "#6B7280",
          },
        },
        Cell: ({ cell }) => (
          <span className=" pl-1 py-2 text-[15px] Inter text-gray-600">
            {cell.getValue() || "Not Data"}
          </span>
        ),
      }),

      columnHelper.accessor("plotFacing", {
        header: "FACING",
        muiTableHeadCellProps: {
          sx: {
            textAlign: "center",
            paddingTop: "20px",
            paddingBottom: "18px",
            fontFamily: "Inter",
            color: "#6B7280",
          },
        },
        Cell: ({ cell }) => (
          <span className=" pl-1 py-2 text-[15px] Inter text-gray-600  ">
            {cell.getValue() || "Not Data"}
          </span>
        ),
      }),

      columnHelper.accessor("plcSide", {
        header: "PLC SIDE",
        muiTableHeadCellProps: {
          sx: {
            textAlign: "center",
            paddingTop: "20px",
            paddingBottom: "18px",
            fontFamily: "Inter",
            color: "#6B7280",
          },
        },
        Cell: ({ cell }) => (
          <span className=" pl-1 py-2 text-[15px] Inter text-gray-600">
            {cell.getValue() || "Not Data"}
          </span>
        ),
      }),

      columnHelper.accessor("plcPercentage", {
        header: "PLC %",
        muiTableHeadCellProps: {
          sx: {
            textAlign: "center",
            paddingTop: "20px",
            paddingBottom: "18px",
            fontFamily: "Inter",
            color: "#6B7280",
          },
        },
        Cell: ({ cell }) => (
          <span className=" pl-1 py-2 text-[15px] Inter text-gray-600">
            {cell.getValue() || "Not Data"}
          </span>
        ),
      }),

      columnHelper.accessor("north", {
        header: "NORTH",
        muiTableHeadCellProps: {
          sx: {
            textAlign: "center",
            paddingTop: "20px",
            paddingBottom: "18px",
            fontFamily: "Inter",
            color: "#6B7280",
          },
        },
        Cell: ({ cell }) => (
          <span className=" pl-1 py-2 text-[15px] Inter text-gray-600">
            {cell.getValue() || "Not Data"}
          </span>
        ),
      }),

      columnHelper.accessor("south", {
        header: "SOUTH",
        muiTableHeadCellProps: {
          sx: {
            textAlign: "center",
            paddingTop: "20px",
            paddingBottom: "18px",
            fontFamily: "Inter",
            color: "#6B7280",
          },
        },
        Cell: ({ cell }) => (
          <span className=" pl-2 py-2 text-[15px] Inter text-gray-600">
            {cell.getValue() || "Not Data"}
          </span>
        ),
      }),

      columnHelper.accessor("east", {
        header: "EAST",
        muiTableHeadCellProps: {
          sx: {
            textAlign: "center",
            paddingTop: "20px",
            paddingBottom: "18px",
            fontFamily: "Inter",
            color: "#6B7280",
          },
        },
        Cell: ({ cell }) => (
          <span className=" pl-1 py-2 text-[15px] Inter text-gray-600">
            {cell.getValue() || "Not Data"}
          </span>
        ),
      }),

      columnHelper.accessor("west", {
        header: "WEST",
        muiTableHeadCellProps: {
          sx: {
            textAlign: "center",
            paddingTop: "20px",
            paddingBottom: "18px",
            fontFamily: "Inter",
            color: "#6B7280",
          },
        },
        Cell: ({ cell }) => (
          <span className=" pl-1 py-2 text-[15px] Inter text-gray-600">
            {cell.getValue() || "Not Data"}
          </span>
        ),
      }),

      columnHelper.accessor("withPlc", {
        header: "WITH PLC",
        muiTableHeadCellProps: {
          sx: {
            textAlign: "center",
            paddingTop: "20px",
            paddingBottom: "18px",
            fontFamily: "Inter",
            color: "#6B7280",
          },
        },
        Cell: ({ cell }) => (
          <span className=" pl-1 py-2 text-[15px] Inter text-gray-600">
            {cell.getValue() || "Not Data"}
          </span>
        ),
      }),

      columnHelper.accessor("additional", {
        header: "ADDITIONAL",
        muiTableHeadCellProps: {
          sx: {
            textAlign: "center",
            paddingTop: "20px",
            paddingBottom: "18px",
            fontFamily: "Inter",
            color: "#6B7280",
          },
        },
        Cell: ({ cell }) => (
          <span className=" pl-1 py-2 text-[15px] Inter text-gray-600">
            {cell.getValue() || "Not Data"}
          </span>
        ),
      }),

      columnHelper.accessor("total", {
        header: "TOTAL",
        muiTableHeadCellProps: {
          sx: {
            textAlign: "center",
            paddingTop: "20px",
            paddingBottom: "18px",
            fontFamily: "Inter",
            color: "#6B7280",
          },
        },
        Cell: ({ cell }) => (
          <span className=" pl-1 py-2 text-[15px] Inter text-gray-600 ">
            {`₹${cell.getValue() || "Not Data"}`}
          </span>
        ),
      }),

      columnHelper.accessor("status", {
        header: "STATUS",
        muiTableHeadCellProps: {
          sx: {
            textAlign: "center",
            paddingTop: "20px",
            paddingBottom: "18px",
            fontFamily: "Inter",
            color: "#6B7280",
          },
        },
        muiTableBodyCellProps: {
          sx: { textAlign: "start", padding: "0.75rem" },
        },
        Cell: ({ row }) => {
          const remainingTime = getRemainingTime(row.original?.hold_expires_at);
          const isHoldActive = remainingTime > 0;

          if (isHoldActive) {
            return (
              <span className="px-2.5 py-1.5 rounded-sm Inter text-sm font-semibold bg-blue-50 text-[#066FA9]">
                Hold ({formatTime(remainingTime)})
              </span>
            );
          }
          return (
            <span
              className={`px-2.5 py-1.5 rounded-sm text-[15px] Inter font-semibold ${
                row.original.status?.toLowerCase() === "available"
                  ? "bg-green-50 text-green-800"
                  : row.original.status?.toLowerCase() === "booked"
                  ? "bg-red-50 text-red-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {row.original.status}
            </span>
          );
        },
      }),

      ...(kycTable !== "kycTable" && kycTable !== "ReviewTable"
        ? [
            columnHelper.display({
              id: "actions",
              header: "BOOK",
              muiTableHeadCellProps: {
                sx: {
                  position: "sticky",
                  right: 0,
                  zIndex: 2,
                  background: "#f9fafb",
                  paddingTop: "20px",
                  paddingBottom: "18px",
                  fontFamily: "Inter",
                  color: "#6B7280",
                },
              },
              muiTableBodyCellProps: {
                sx: {
                  position: "sticky",
                  right: 0,
                  zIndex: 1,
                  background: "white",
                },
              },
              Cell: ({ row }) => {
                const remainingTime = getRemainingTime(
                  row.original?.hold_expires_at
                );
                const isHoldActive = remainingTime > 0;
                const booked = row.original?.booked;

                return (
                  <button
                    onClick={() => handleBookNow(row.original.plotNo)}
                    className={`font-semibold Inter px-4 py-2 text-[14px] flex items-center gap-2 w-fit rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:shadow-xl ${
                      booked || isHoldActive
                        ? "bg-[#D1D5DB] text-[#4B5563] cursor-not-allowed"
                        : "hover:bg-[#055a87] bg-[#066FA9] text-white cursor-pointer"
                    }`}
                    disabled={booked || isHoldActive}
                  >
                    {loadingRow === row.original.plotNo
                      ? "Loading..."
                      : booked
                      ? "Booked"
                      : isHoldActive
                      ? "Hold"
                      : "Book Now"}
                  </button>
                );
              },
            }),
          ]
        : []),
    ];
    const table = useMaterialReactTable({
      columns,
      data: tableData,
      enableRowSelection: false,
      enableHiding: false,
      enableColumnActions: false,
      enableSorting: false,
      enableFilters: true,
      enableDensityToggle: false,
      enableFullScreenToggle: false,
      columnFilterDisplayMode: "popover",
      paginationDisplayMode: "pages",
      positionToolbarAlertBanner: "bottom",
      enableGlobalFilter: true,
      globalFilterFn: "includesString",
      onGlobalFilterChange: setSearchText,
      state: { globalFilter: searchText },
      initialState: {
        pagination: {
          pageSize: 25,
        },
      },
      muiTablePaperProps: {
        elevation: 0,
        sx: {
          borderRadius: "12px 12px 12px 12px",
        },
      },

      muiPaginationProps: {
        sx: {
          display: "flex",
          justifyContent: "center",
          "& .MuiPagination-ul": { justifyContent: "center" },
          "& .MuiPaginationItem-root": { color: "#000" },
          "& .MuiPaginationItem-page.Mui-selected": {
            backgroundColor: "#066FA9",
            color: "white",
          },
        },
      },

      muiTableContainerProps: {
        sx: {
          overflow: "auto",
          "&::-webkit-scrollbar": { height: "6px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e1",
            borderRadius: "20px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#e5e7eb",
            borderRadius: "20px",
          },
          "-ms-overflow-style": "auto",
          "scrollbar-width": "12px",
        },
      },
    });

    return <MaterialReactTable table={table} />;
  }
);

InventoryTable2.displayName = "InventoryTable2";
export default InventoryTable2;
