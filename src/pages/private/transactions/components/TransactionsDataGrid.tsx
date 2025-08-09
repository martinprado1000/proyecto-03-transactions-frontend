import { forwardRef } from "react";
import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";

import {
  GridRowModes,
  DataGrid,
  GridEditInputCell,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  type GridRowModesModel,
  type GridRenderEditCellParams,
  //type GridRowEditStopParams,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { Chip, Stack } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import Tooltip, {
  tooltipClasses,
  type TooltipProps,
} from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import type { GridColDef } from "@mui/x-data-grid";

//Sweet Alert 2
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import { format } from 'date-fns';

import {
  validateAmountFn,
  validateDateFn,
  validateDescriptionFn,
  validateObservationFn,
  validateUserIdFn,
} from "./ValidationsDataGrid";
import {
  ActionTransactionEnum,
  AreaEnum,
  CategoryEnum,
  MeansOfPaymentEnum,
  type TransactionsType,
} from "src/contexts/interfaces/transactions.interfaces";
import { useTransactionsContext } from "src/contexts/TransactionsContext";

// Type props del EditToolbar
interface EditToolbarProps {
  setRows: React.Dispatch<React.SetStateAction<TransactionsType[]>>;
  setRowModesModel: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

//----------------EDIT TOOLBAR--------------------------------------------------------------------------------
const randomId = () => `temp-${Date.now() + Math.random()}`;
function EditToolbar(props: EditToolbarProps) {
  // Obtengo las funciones de EditToolbar
  // setRows: Función para actualizar el estado de las filas del DataGrid, viene con las filas actuales.
  // setRowModesModel: Función para controlar los modos de edición de las filas
  const { setRows, setRowModesModel } = props; // Destructura las 2 funciones
  const date: string = format(new Date(), 'yyyy-MM-dd');
  const handleClick = () => {
    const id = randomId();
    setRows((oldRows: TransactionsType[]) => [
      {
        id,
        userId: "",
        description: "",
        date,
        amount: 0,
        category: CategoryEnum.VARIOS,
        meansOfPayment: MeansOfPaymentEnum.OTROS,
        observation: "",
        area: AreaEnum.OTROS,
        isActive: true,
        isNew: true,
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      // Establezco el modo de la fila
      ...oldModel, // Le establezco los datos anteriores
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "userId" }, // le establezco el modo edicion (GridRowModes.Edit) a la fila con el id recien generado.
    }));
  };
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

const StyledTooltip = styled(
  ({ className, ...props }: { className?: string } & TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

const DataEditInputCell = forwardRef<HTMLDivElement, any>(
  (props: { error?: string } & any, ref) => {
    const { error, ...other } = props;
    return (
      <StyledTooltip open={!!error} title={error}>
        <div ref={ref} style={{ width: "100%", height: "100%" }}>
          <GridEditInputCell {...other} />
        </div>
      </StyledTooltip>
    );
  }
);

function renderEditData(params: GridRenderEditCellParams) {
  return <DataEditInputCell {...params} />;
}

// ****** EXPORT UsersDataGridWithPassword ******************************************************************************
export default function TransactionsDataGrid() {
  //const navigate = useNavigate();
  const {
    getTransactions,
    transactions,
    categories,
    meansOfPayment,
    areas,
    actionTransaction,
  } = useTransactionsContext();
  //const { userAuth, userLogOut } = useAuthContext();
  const [rows, setRows] = useState<TransactionsType[]>([]);
  const [rowModesModel, setRowModesModel] = useState<Record<string, any>>({});

  useEffect(() => {
    // Obtenemos los usuarios.
    getTransactions();
  }, []);

  // Actualizar rows cuando cambian los usuarios
  useEffect(() => {
    if (transactions) {
      setRows(transactions);
    }
  }, [transactions]);

  const validateUserId = validateUserIdFn(rows);
  const validateDescription = validateDescriptionFn(rows);
  const validateDate = validateDateFn(rows);
  const validateAmount = validateAmountFn(rows);
  const validateObservation = validateObservationFn(rows);

  const handleRowEditStop = (params: any, event: any) => {
    // Estos dos parametros los declaro como any porque MUI tiene un bug con en los types
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const handleEditClick = (id: number | string) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };
  const handleSaveClick = (id: number | string) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };
  const handleCancelClick = (id: number | string) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };
  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // ELIMINO USUARIO.
  const handleDeleteClick = (id: string) => async () => {
    const result = await Swal.fire({
      title: "¿Estas seguro?",
      text: "El transacción será eliminado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
      focusConfirm: true,
    });

    if (result.isConfirmed) {
      const res = await actionTransaction(
        ActionTransactionEnum.delete,
        undefined,
        id
      );

      if (res?.error) {
        Swal.fire({
          title: res.message,
          icon: "error",
          timer: 6000,
          timerProgressBar: true,
        });
        throw new Error(res.message);
      }

      setRows(rows.filter((row) => row.id !== id));
      // Swal.fire({
      //   title: "Eliminado",
      //   text: "El usuario a sido eliminado",
      //   icon: "success",
      //   timer: 1500,
      //   timerProgressBar: true,
      // });
    }
  };

  const processRowUpdate = async (transaction: TransactionsType) => {
    // if (transaction.isActive === "Activo") transaction.isActive = true;
    // if (transaction.isActive === "Inactivo") transaction.isActive = false;
    let res;
    if (transaction.isNew) {
      // NUEVA TRANSACCIÓN ---------------------------------------------------------------------.
      const tempId = transaction.id as string; // Guardamos el ID temporal
      res = await actionTransaction(ActionTransactionEnum.add, transaction);
      if (res.error) {
        Swal.fire({
          title: res.message,
          icon: "error",
          timer: 6000,
          timerProgressBar: true,
        });
        throw new Error(res.message);
      }

      // Si es exitoso, actualiza el estado
      const newRow = {
        ...res, // Usa los datos del backend
        isNew: false,
      };

      // Actualiza rows REEMPLAZANDO la fila temporal
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === tempId ? newRow : row))
      );

      // Actualiza el modo de edición
      setRowModesModel((prev) => ({
        ...prev,
        [tempId]: { mode: GridRowModes.View }, // Cierra el modo edición
      }));

      return newRow;
    } else {
      // EDITO TRANSACCIÓN ---------------------------------------------------------------------.
      res = await actionTransaction(ActionTransactionEnum.edit, transaction, transaction.id);
      console.log(res)
      if (res.error) {
        Swal.fire({
          title: res.message,
          icon: "error",
          timer: 6000,
          timerProgressBar: true,
        });
        throw new Error(res.message);
      }

      const updatedRow = { ...transaction, isNew: false };
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === transaction.id ? updatedRow : row))
      );
      return updatedRow;
    }
  };

  const columns: GridColDef[] = [
    {
      field: "userId",
      headerName: "UserId",
      //headerAlign: "right",
      //align: "right",
      flex: 1,
      minWidth: 100,
      editable: true,
      preProcessEditCellProps: async (params) => {
        const errorMessage = await validateUserId({
          id: params.id,
          userId: params.props.value.toString(),
        });
        // const value = { ...params.props, error: errorMessage };
        //console.log(value); // obtengo el objeto entero editado, aca tambien veo la propiedad error,
        return { ...params.props, error: errorMessage };
      },
      renderEditCell: renderEditData,
    },
    {
      field: "description",
      headerName: "Description",
      //headerAlign: "right",
      //align: "right",
      flex: 1,
      minWidth: 100,
      editable: true,
      preProcessEditCellProps: async (params) => {
        const errorMessage = await validateDescription({
          id: params.id,
          description: params.props.value.toString(),
        });
        // const value = { ...params.props, error: errorMessage };
        //console.log(value); // obtengo el objeto entero editado, aca tambien veo la propiedad error,
        return { ...params.props, error: errorMessage };
      },
      renderEditCell: renderEditData,
    },
    {
      field: "date",
      headerName: "Date",
      //headerAlign: "right",
      //align: "right",
      flex: 1,
      minWidth: 120,
      editable: true,
      preProcessEditCellProps: async (params) => {
        const errorMessage = await validateDate({
          id: params.id,
          date: params.props.value.toString(),
        });
        // const value = { ...params.props, error: errorMessage };
        return { ...params.props, error: errorMessage };
      },
      renderEditCell: renderEditData,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
      minWidth: 120,
      editable: true,
      preProcessEditCellProps: async (params) => {
        const errorMessage = await validateAmount({
          id: params.id,
          amount: params.props.value.toString(),
        });
        // const value = { ...params.props, error: errorMessage };
        return { ...params.props, error: errorMessage };
      },
      renderEditCell: renderEditData,
      renderCell: (params) => (
        <span
          style={{
            color: Number(params.value) < 0 ? "red" : "blue",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      headerClassName: "category",
      editable: true,
      //headerAlign: "right",
      //align: "right",
      flex: 1,
      minWidth: 100,
      type: "singleSelect",
      valueOptions: categories,
    },
    {
      field: "meansOfPayment",
      headerName: "MeansOfPayment",
      headerClassName: "meansOfPayment",
      editable: true,
      //headerAlign: "right",
      //align: "right",
      flex: 1,
      minWidth: 100,
      type: "singleSelect",
      valueOptions: meansOfPayment,
    },
    {
      field: "observation",
      headerName: "Observation",
      //headerAlign: "right",
      //align: "right",
      flex: 1,
      minWidth: 100,
      editable: true,
      preProcessEditCellProps: async (params) => {
        const errorMessage = await validateObservation({
          id: params.id,
          observation: params.props.value.toString(),
        });
        // const value = { ...params.props, error: errorMessage };
        //console.log(value); // obtengo el objeto entero editado, aca tambien veo la propiedad error,
        return { ...params.props, error: errorMessage };
      },
      renderEditCell: renderEditData,
    },
    {
      field: "area",
      headerName: "Area",
      headerClassName: "area",
      editable: true,
      //headerAlign: "right",
      //align: "right",
      flex: 1,
      minWidth: 100,
      type: "singleSelect",
      valueOptions: areas,
    },
    {
      field: "isActive",
      headerName: "Status",
      editable: true,
      flex: 1,
      minWidth: 100,
      type: "singleSelect",
      valueOptions: [
        { value: true, label: "Activo" },
        { value: false, label: "Inactivo" },
      ],
      renderCell: (params) => {
        const value = params.value;

        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="left"
            sx={{ width: "100%", height: "100%" }}
          >
            {value === true ? (
              <Chip
                icon={
                  <CheckCircleRoundedIcon
                    sx={{ fontSize: 22, marginLeft: "4px" }}
                  />
                }
                label="Activo"
                color="success"
                variant="outlined"
                sx={{
                  height: 32,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  "& .MuiChip-icon": {
                    fontSize: 20,
                  },
                }}
              />
            ) : (
              <Chip
                icon={
                  <ErrorRoundedIcon sx={{ fontSize: 22, marginLeft: "4px" }} />
                }
                label="Inactivo"
                color="error"
                variant="outlined"
                sx={{
                  height: 32,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  "& .MuiChip-icon": {
                    fontSize: 20,
                  },
                }}
              />
            )}
          </Stack>
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
        // En cada vuelta del arreglo agrego el action.
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(String(id))} // String(id) lo tengo que pasar asi porque en el tipado de MUI dice que puede ser un numero
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <DataGrid
      //checkboxSelection // Habilita checkboxes para seleccionar filas
      rows={rows}
      columns={columns}
      editMode="row" // habilita la edicion de la fila completa por lo tanto podemos usar el tab para movernos entre las columnas.
      getRowClassName={(
        params // Alterna clases CSS 'even' y 'odd' para filas pares e impares, No esta funcionando
      ) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
      initialState={{
        // Estado inicial de la paginacion
        pagination: { paginationModel: { pageSize: 20 } },
      }}
      pageSizeOptions={[10, 20, 50]} // Valores de la paginacion
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModesModelChange}
      onRowEditStop={handleRowEditStop}
      processRowUpdate={processRowUpdate}
      sx={{
        boxShadow: 2, // Sombreado
        border: 2,
        borderColor: "green",
        "& .MuiDataGrid-cell:hover": {
          // Aplico el color azul cuando este hover
          color: "blue",
        },
        "& .roles": {
          // Nombre de la cabecera .Roles le asigne al background rojo
          color: "red",
        },
      }}
      // disableColumnResize  // Deshabilita poder modificar el ancho de la columna.
      // density="compact" // Deshabilito la densidad compacta para que sea editable.
      //-----------TOOLBAR--------------------------------------------------------------------------------------------
      slots={{
        toolbar: GridToolbarContainer,
      }}
      slotProps={{
        //---------TOOLBAR PROPERTI--------------------------------------------------------------------------------------------
        toolbar: {
          children: (
            <>
              <GridToolbar showQuickFilter={true} />
              <EditToolbar
                setRows={setRows}
                setRowModesModel={setRowModesModel}
              />
            </>
          ),
        },
        //-----------FILTER PANEL--------------------------------------------------------------------------------------------
        // Por defecto en el DataGrid viene el filtro, aca configura los estilos.
        filterPanel: {
          filterFormProps: {
            logicOperatorInputProps: {
              variant: "outlined",
              size: "small",
            },
            columnInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            operatorInputProps: {
              variant: "outlined",
              size: "small",
              sx: { mt: "auto" },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: "outlined",
                size: "small",
              },
            },
          },
        },
      }}
    />
  );
}
