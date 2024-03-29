import {
    Modal,
    Box,
    Typography,
    TextField,
    MenuItem,
    LinearProgress,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup, Avatar, Backdrop, CircularProgress,
} from "@mui/material";
import "./index.css";
import React, {useCallback, useEffect, useState} from "react";
import CustomButton from "../components/Button/CustomButton";
import CustomInput from "../components/Input/CustomInput";
import {styles as modalTheme} from "../containts";
import {useSnackbar} from "notistack";
import {useApi} from "../hooks/useApi";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {UserEntity} from "../models/UserEntity";
import {useNavigate} from "react-router-dom";
import {DataGrid, GridColDef, GridRowId} from "@mui/x-data-grid";
import ButtonOutlined from "../components/Button/ButtonOutlined";
import {AddCircle, DoneAll, RemoveDone} from "@mui/icons-material";
import {ConfirmDialog} from "../components/Dialog/ConfirmDialog";
import {deleteObjectFirebase} from "../firebase/deleteObject";

export default function UsersPage() {
    const {enqueueSnackbar} = useSnackbar();

    //#region useState
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [user, setUser] = useState<UserEntity>();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [users, setUsers] = useState<UserEntity[]>([]);
    const [userSelects, setUserSelects] = useState<GridRowId[]>([]);
    const [sex, setSex] = useState(true);
    const [openConfirm, setOpenConfirm] = useState(false);
    const navigate = useNavigate();

    //#region onChange
    const handleChangeTextSelect = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRole(event.target.value);
    };


    const onChangeName = (e: any) => {
        setName(e.target.value);
    };

    const onChangeEmail = (e: any) => {
        setEmail(e.target.value);
    };

    const onChangePhone = (e: any) => {
        setPhone(e.target.value);
    };

    const onChangePassword = (e: any) => {
        setPassword(e.target.value);
    };

    const onChangeConfirmPassword = (e: any) => {
        setConfirmPassword(e.target.value);
    };

    //#endregion
    const roles = [
        {
            role: "User",
        },
        {
            role: "Administrator",
        },
    ];

    const cleanUp = () => {
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setPhone("");
        setRole("");
    };
    const handleCloseModal = () => {
        setOpenModal(false);
        cleanUp();
    };

    //#region Call Api
    const {callApi} = useApi();

    const createUser = () => {
        console.log("createUser");
        setLoading(true);
        callApi(REQUEST_TYPE.POST, "api/users/register", {
            name: name,
            email: email,
            phone: phone,
            password: password,
            confirmPassword: confirmPassword,
            avatar: "",
            sex: sex,
            role: role,
        })
            .then(() => {
                enqueueSnackbar("Create User Success!", {variant: "success"});
                setLoading(false);
                setOpenModal(false);
                getUsers();
                cleanUp();
            })
            .catch((err) => {
                setLoading(false);
                enqueueSnackbar("Create User Fail!", {variant: "error"});
                console.error(err);
            });
    };

    const deleteUser = (id: any) => {
        callApi(REQUEST_TYPE.DELETE, `api/users/${id}`)
            .then(() => {
                enqueueSnackbar("Delete user success!", {variant: 'success'})
                getUsers();
                setOpenConfirm(false);
            })
            .catch(() => {
                enqueueSnackbar("Delete use is failed", {variant: 'error'});
            })
    }

    const getUsers = useCallback(() => {
        callApi<UserEntity[]>(REQUEST_TYPE.GET, "api/users")
            .then((res) => {
                setLoading(false);
                setUsers(res.data);
            }).catch((err) => {
            console.error(err)
        })
    }, [callApi]);

    const getUserId = (id: any) => {
        callApi<UserEntity>(REQUEST_TYPE.GET, `api/users/${id}`)
            .then((res) => {
                setLoading(true)
                setUser(res.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const handleDeleteUser = () => {
        if (user?.avatar === '') {
            deleteUser(userSelects[0]);
        } else {
            deleteObjectFirebase(user?.avatar!);
            deleteUser(userSelects[0]);
        }
    }

    useEffect(() => {
        return () => {
            getUsers()
        };
    }, [getUsers]);


    const columnUsers: GridColDef[] = [
        {
            field: "avatar",
            renderHeader: () => <Typography className={"style-header-grid"}>Avatar</Typography>,
            width: 100,
            renderCell: params => <Avatar src={params.value}/>,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: "name",
            renderHeader: () => <Typography className={"style-header-grid"}>Name</Typography>,
            width: 200,
            headerAlign: 'center'
        },
        {
            field: "email",
            renderHeader: () => <Typography className={"style-header-grid"}>Email</Typography>,
            headerAlign: 'center',
            width: 200
        },
        {
            field: "wallet",
            renderHeader: () => <Typography className={"style-header-grid"}>Money</Typography>,
            width: 100,
            renderCell: params => params.value.money,
            headerAlign: 'center',
            align: "center"
        },
        {
            field: "sex",
            renderHeader: () => <Typography className={"style-header-grid"}>Sex</Typography>,
            width: 100,
            headerAlign: 'center',
            align: 'center',
            renderCell: params => params.value ? "Male" : "Female"
        },
        {
            field: "premium",
            renderHeader: () => <Typography className={"style-header-grid"}>Premium</Typography>,
            width: 100,
            headerAlign: 'center',
            align: 'center',
            renderCell: params => params.value ? <DoneAll color={'success'}/> : <RemoveDone color={'error'}/>
        },
        {
            field: "dateUse",
            renderHeader: () => <Typography className={"style-header-grid"}>Date Use</Typography>,
            width: 200,
            renderCell: params => params.value,
            headerAlign: 'center'
        },
    ];

    //#endregion
    return (
        <div style={{
            padding: 2
        }}>

            <Box sx={{
                ":hover": {
                    cursor: 'pointer'
                },
                height: 500
            }}>
                <DataGrid
                    rows={users}
                    columns={columnUsers}
                    onCellDoubleClick={(itm) => {
                        navigate(`${itm.id}`)
                    }}
                    onSelectionModelChange={(itm) => {
                        setUserSelects(itm)
                        console.log(itm)
                    }}
                />
            </Box>
            <ConfirmDialog
                open={openConfirm}
                handleCancel={() => setOpenConfirm(false)}
                handleOk={() => handleDeleteUser()}
                title={"Do you really want to delete it?"}
            />
            <Box margin={1}>
                <ButtonOutlined color={'success'} onClick={() => setOpenModal(true)}>
                    <AddCircle fontSize={'small'}/>
                </ButtonOutlined>
            </Box>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={modalTheme}>
                    <Typography fontSize={25} fontWeight={'bold'}>ADD USER</Typography>
                    <Box width={400} display={'flex'} flexDirection={"column"} alignItems={'center'}>

                        <Box className="dp-flex">
                            <CustomInput
                                placeholder="Name"
                                label="Name"
                                value={name}
                                onChange={onChangeName}
                            />
                            <CustomInput
                                placeholder="Email"
                                label="Email"
                                value={email}
                                onChange={onChangeEmail}
                            />
                        </Box>
                        <CustomInput
                            placeholder="Phone"
                            label="Phone"
                            value={phone}
                            onChange={onChangePhone}
                        />
                        <Box className="dp-flex">
                            <CustomInput
                                placeholder="Password"
                                label="Password"
                                value={password}
                                onChange={onChangePassword}
                                icon={true}
                            />
                            <CustomInput
                                placeholder="Password"
                                label="Password"
                                value={confirmPassword}
                                onChange={onChangeConfirmPassword}
                                icon={true}
                            />
                        </Box>
                        <TextField
                            margin="normal"
                            select
                            fullWidth
                            value={role}
                            onChange={handleChangeTextSelect}
                            label="Role"
                        >
                            {roles.map((option) => (
                                <MenuItem key={option.role} value={option.role}>
                                    {option.role}
                                </MenuItem>
                            ))}
                        </TextField>
                        <FormControl>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="male"
                                name="radio-buttons-group"
                            >
                                <Box>
                                    <FormControlLabel
                                        value="male"
                                        control={<Radio color="error"/>}
                                        label="Male"
                                        onClick={() => setSex(true)}
                                    />
                                    <FormControlLabel
                                        value="female"
                                        control={<Radio color="error"/>}
                                        label="Female"
                                        onClick={() => setSex(false)}
                                    />
                                </Box>
                            </RadioGroup>
                        </FormControl>
                        <CustomButton color="error" text="SUBMIT" onClick={createUser}/>
                        <CustomButton
                            color="inherit"
                            text="CLOSE"
                            onClick={handleCloseModal}
                        />
                        <Backdrop open={loading}>
                            <CircularProgress color={'error'}/>
                        </Backdrop>
                    </Box>
                </Box>
            </Modal>

        </div>
    );
}
