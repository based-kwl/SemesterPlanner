/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import {useNavigate} from "react-router";
import axios from "axios";
import {InputAdornment, Typography} from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {PrimaryButton2, SelectButton} from "../CustomMUIComponents/CustomButtons";
import TextField from "@mui/material/TextField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {BackgroundCard, CustomWhiteCard} from "../CustomMUIComponents/CustomCards";
import {faculties, programs} from "../Authentication/SignUp";
import PersistentDrawerLeft from "../NavDrawer/navDrawer";
import {useCallback, useEffect, useRef} from "react";


export default function EditProfile() {

    const [userData, setUserData] = React.useState({
        username: '',
        email: '',
        password: '',
        faculty: 'Art & Science',
        program: 'Actuarial Mathematics',
        privateProfile: true
    });

    const newPassword = useRef('');
    const userEmail = React.useMemo(() => JSON.parse(localStorage.getItem("email")), []);
    const token =  React.useMemo(() => JSON.parse(localStorage.getItem("token")), []);

    const [registrationError, setRegistrationError] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const navigate = useNavigate();

    const fetchData = useCallback(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}student/email/${userEmail}`)
            .then((res) => {
                const data = res.data;
                setUserData({
                    ...userData,
                    username: data.username,
                    email: userEmail,
                    password: data.password,
                    faculty: data.faculty,
                    program: data.program,
                    privateProfile: data.privateProfile
                })
            }
        ).catch((err) => setRegistrationError(err.message));
    }, [])

    useEffect(() => {
        fetchData();
    },[])

    function handleEditProfile() {

        const config = {
            headers: {authorization: `Bearer ${token}`}
        }
        axios.post(`${process.env.REACT_APP_BASE_URL}student/update/${userEmail}`, userData, config)
            .then(res => {
                navigate('/calendar');
            })
            .catch(err => {
                setRegistrationError("Error connecting to database");
            });
    }

    function handleProgramChange(e) {
        setUserData({...userData, program: e.target.value})
    }

    function handleUsernameChange(e) {
        setUserData({...userData, username: e.target.value})
    }

    function handlePasswordChange(e) {
        newPassword.current = e.target.value;
        setUserData({...userData, password: e.target.value})
    }

    function handlePrivacyChange() {
        setUserData({...userData, privateProfile: !userData.privateProfile})
    }

    function handleConfirmPasswordChange(e) {
        setConfirmPassword(e.target.value);
        if (e.target.value === userData.password) {
            if (registrationError === "Both passwords should match") {
                setRegistrationError("");
            }
        } else {
            setRegistrationError("Both passwords should match")
        }
    }

    const PageError =  React.useMemo(() => (registrationError !== ""
        ? (
            <Typography align="center" color="#DA3A16">
                {registrationError}
            </Typography>
        )
        : null), [registrationError]);

    const ProgramSelect = (
        <Container maxWidth="md" component="main">
            <Grid container spacing={2} alignItems="flex-end">
                {faculties.map((item) => (
                    <Grid
                        item
                        key={item}
                        xs={6}
                        md={6}
                    >
                        <SelectButton userData={userData} setUserData={setUserData} content={item}/>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )

    const SignUpForm = (
        <React.Fragment>
            <form style={{paddingLeft: '10px', paddingRight: '10px'}}>
                <div style={{paddingTop: '10px', paddingBottom: '10px'}}>{PageError}</div>
                <div style={{paddingTop: '10px', paddingBottom: '10px'}}>
                    <TextField
                        fullWidth
                        id='username'
                        value={userData.username}
                        required
                        label="Username"
                        variant='outlined'
                        onChange={handleUsernameChange}
                    />
                </div>

                <div style={{paddingTop: '10px', paddingBottom: '10px'}}>
                    <TextField fullWidth
                               id='password'
                               type='password'
                               required
                               label="New Password"
                               variant='outlined'
                               onChange={handlePasswordChange}
                               InputProps={{
                                   endAdornment: <InputAdornment
                                       position="end"><VisibilityIcon/></InputAdornment>,
                               }}
                    />
                </div>
                <div style={{paddingTop: '10px', paddingBottom: '10px'}}>
                    <TextField fullWidth
                               id='confirmPassword'
                               type='password'
                               required
                               label="Confirm Password"
                               variant='outlined'
                               onChange={handleConfirmPasswordChange}
                               InputProps={{
                                   endAdornment: <InputAdornment
                                       position="end"><VisibilityIcon/></InputAdornment>,
                               }}
                    />
                </div>
                <div style={{paddingTop: '10px', paddingBottom: '10px'}}>
                    <Typography>
                        Which faculty are you in?
                    </Typography>
                </div>
                <div style={{paddingTop: '10px', paddingBottom: '10px'}}>
                    {ProgramSelect}
                </div>
                <div style={{paddingTop: '10px', paddingBottom: '10px'}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Program</InputLabel>
                        <Select
                            id="program"
                            value={userData.program}
                            label="Program"
                            onChange={handleProgramChange}
                        >
                            {programs[userData.faculty].map((item) => (
                                <MenuItem key={item} value={item}>
                                    <em>{item}</em>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div style={{paddingTop: '10px', paddingBottom: '30px'}}>
                    <Typography>
                        Hide my profile
                    </Typography>
                    <FormControlLabel sx={{display: 'block'}} control={
                        <Switch
                            checked={userData.privateProfile}
                            onChange={handlePrivacyChange}
                        />
                    } label={userData.privateProfile ? "Public" : "Private"}/>
                </div>
                <PrimaryButton2 width='305px' content="Update" onClick={handleEditProfile}/>
            </form>
        </React.Fragment>
    )

    const InfoEdit = (
        <CustomWhiteCard width='326px' height='780px' marginTop='30px' content={SignUpForm}/>
    )

    return (
        <React.Fragment>
            <PersistentDrawerLeft/>
            <div style={{paddingTop: '60px'}}>
                <BackgroundCard width='372px' height='920px' content={InfoEdit}/>
            </div>
        </React.Fragment>
    );
}