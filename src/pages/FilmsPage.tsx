//#region IMPORT
import {
    Box,
    LinearProgress, Typography,
} from "@mui/material";
import "./index.css";
import {useCallback, useEffect, useState} from "react";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useApi} from "../hooks/useApi";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {useSnackbar} from "notistack";
import {FilmEntity} from "../models/FilmEnity";
import {ConfirmDialog} from "../components/Dialog/ConfirmDialog";
import {SubHeader} from "../components/Header/SubHeader";
import {useNavigate} from "react-router-dom";
import {deleteObjectFirebase} from "../firebase/deleteObject";
import ButtonOutlined from "../components/Button/ButtonOutlined";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
//#endregion

export default function FilmsPage() {
    //#region State
    const [openDialog, setOpenDialog] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [films, setFilms] = useState<FilmEntity[]>([]);
    const [film, setFilm] = useState<FilmEntity>();
    const [loading, setLoading] = useState(false);
    const [keyName, setKeyName] = useState("");
    const navigate = useNavigate();
    const {callApi} = useApi();

    //#region Call Api
    const getFilms = useCallback(() => {
        setLoading(true);
        console.log('films')
        callApi<FilmEntity[]>(REQUEST_TYPE.GET, "api/films")
            .then((res) => {
                setLoading(false);
                setFilms(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [callApi]);

    useEffect(() => {
        return () => {
            getFilms()
        };
    }, [getFilms]);



    const columns: GridColDef[] = [
        {
            field: 'webUrl',
            renderHeader: () => <Typography className={"style-header-grid"}>Poster</Typography>,
            renderCell: params => <img width={100} alt={''} src={params.value}/>,
            headerAlign: 'center',
        },
        {
            field: 'name',
            renderHeader: () => <Typography className={"style-header-grid"}>Name</Typography>,
            headerAlign: 'center',
            width: 200
        },
        {
            field: 'views',
            renderHeader: () => <Typography className={"style-header-grid"}>Views</Typography>,
            headerAlign: 'center'
        },
        {
            field: 'producer',
            renderHeader: () => <Typography className={"style-header-grid"}>Producer</Typography>,
            renderCell: params => params.value.name,
            headerAlign: 'center'
        },
    ]

    return (
        <Box>
            {loading ? <LinearProgress color="secondary"/> : ""}
            <Box sx={{
                ":hover": {
                    cursor: 'pointer'
                }
            }}>
                <DataGrid
                    onCellDoubleClick={(itm) => navigate(`${itm.id}`)}
                    columns={columns}
                    rows={films} autoHeight={true}
                    checkboxSelection
                />
            </Box>
            <ButtonOutlined color={"success"}>
                <AddIcon/>
            </ButtonOutlined>
            <ButtonOutlined>
                <RefreshIcon/>
            </ButtonOutlined>
            <ButtonOutlined color={"error"}>
                <DeleteIcon/>
            </ButtonOutlined>

        </Box>
    );
}
