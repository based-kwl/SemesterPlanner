import * as React from 'react';
import TextField from '@mui/material/TextField';
import {Box, Button, InputAdornment, Link, Typography} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Card from '@mui/material/Card';



export default function UserSignIn() {


    return (
        <Card variant='outlined' style={{
            width: '372px',
            height: '785px',
            justifyContent: 'center',
            backgroundColor: '#E9E3D3',
            margin: 'auto'
        }}>
            <p align='center' style={{
                fontFamily: 'Roboto',
                fontSize: '34px',
                fontWeight: 'bold',
                backgroundColor: '#E9E3D3',
                marginTop: '110px',
                marginBottom: '16px'
            }}>
                Semester Planner
            </p>
            <Card style={{
                borderRadius: '15px',
                margin: 'auto',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                width: '326px',
                height: '400px',
                marginTop: '50px'
            }} variant='outlined'>
                <form>
                    <Box>
                        <Typography align='center' style={{fontFamily: 'Roboto', fontSize: '30px', fontWeight: 'bold'}}>Sign
                            in</Typography>
                        <div align='center' style={{paddingTop: '16px', paddingBottom: '20px'}}>
                            <div style={{paddingTop: '16px', paddingBottom: '20px'}}>
                                <TextField
                                           style={{width: '305px'}}
                                           id='email'
                                           type='email'
                                           required
                                           label="Email"
                                           variant='outlined'
                                           InputProps={{
                                               endAdornment: <InputAdornment
                                                   position="end"><MailOutlineIcon/></InputAdornment>,
                                           }}

                                />
                            </div>

                            <div>
                                <TextField style={{width: '305px'}}
                                           id='password'
                                           type='password'
                                           required
                                           label="Password"
                                           variant='outlined'
                                           InputProps={{
                                               endAdornment: <InputAdornment
                                                   position="end"><VisibilityIcon/></InputAdornment>,
                                           }}
                                />
                            </div>

                            <div style={{paddingTop: '16px'}}>
                                <Button
                                    type='submit'
                                    variant="contained"
                                    style={{
                                        paddingTop: '11px', paddingBottom: '11px',
                                        width: '305px', backgroundColor: '#912338'
                                    }}>
                                    Sign in
                                </Button>
                            </div>

                            <Typography style={{paddingTop: '16px', paddingBottom: '20px'}}>
                                Don't have an account?&nbsp;
                                <Link href='/user-registration'
                                      style={{color: '#912338', textDecorationColor: '#912338'}}>
                                    {'Register here'}
                                </Link>
                            </Typography>
                        </div>
                    </Box>
                </form>
            </Card>
        </Card>

    )
}