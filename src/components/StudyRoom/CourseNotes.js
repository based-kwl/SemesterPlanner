import * as React from 'react';
import {useEffect, useMemo, useRef, useState} from "react";
import {FileCard} from "./StudyRoomCards";
import Button from '@mui/material/Button';
import ClearIcon from '@mui/icons-material/Clear';
import {PrimaryButton2, FileSelectButton} from "../CustomMUIComponents/CustomButtons"
import axios from "axios";
import {Buffer} from 'buffer'

// // @ts-ignore
// window.Buffer = Buffer;

export default function ParticipantsList() {
    // const studyRoomID = window.location.href.split("/")[window.location.href.split("/").length - 1]; // TODO: uncomment after merging to sp-47
    const studyRoomID = '92rl1sf1l1';
    const [fileList, setFileList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const fileListTop = useRef(null);

    function getCourseNotes(){
        // axios.get(`${process.env.REACT_APP_BASE_URL}room/fetch/${studyRoomID}`) //TODO: uncomment after merging to sp-47 branch
        axios.get(`http://localhost:5000/room/files/${studyRoomID}`)
            .then(res => {
                setFileList(res.data.reverse());
            })
            .catch(err => {console.log(`Error: ${err}`); setErrorMessage(`${err}`.substring(44) == 401 ? 'request could not be sent' : `${err}`)});
    }

    function handleDeleteCourseNotes(index) {
        axios.delete(`http://localhost:5000/room/file/${fileList[index].cnID}`)
            .then((res) => {
                console.log(res);
                getCourseNotes();
            })
            .catch(err => {console.log(`Error: ${err}`); setErrorMessage(`${err}`.substring(44) == 401 ? 'request could not be sent' : `${err}`)});
        getCourseNotes();
    }

    async function handleUploadCourseNotes() {
        if (isFilePicked ) {
            let bufferedFile = null;
            const reader = new FileReader();

            reader.readAsText(selectedFile);

            reader.onloadend = (event) => {
                bufferedFile = Buffer.from(event.target.result, "utf-8");

                axios.post('http://localhost:5000/room/file', {
                    sID: studyRoomID,
                    type: selectedFile.type,
                    email: JSON.parse(localStorage.getItem("email")),
                    name: selectedFile.name,
                    size: (selectedFile.size/1024).toFixed(1).toString(),
                    file: bufferedFile
                })
                    .then(() => {
                        setErrorMessage('');
                        getCourseNotes();
                        setSelectedFile(null);
                        setIsFilePicked(false);
                    })
                    .catch(err => {
                        console.log(`Error: ${err}`);
                        setErrorMessage(`${err}`.substring(44) === (401).toString() ? 'request could not be sent' : `${err}`)
                    });
            }
        } else if (!isFilePicked) {
            setErrorMessage("No file selected!")
        } else if (selectedFile.type !== "text/plain") {
            setErrorMessage("Only text files are supported!")
        }
    }

    const handleFileSelect = (event) => {
        if (event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setIsFilePicked(true);
        } else {
            setSelectedFile(null);
            setIsFilePicked(false);
        }
    };

    function handleFileClick(index) {
        axios.get(`http://localhost:5000/room/file/${fileList[index].cnID}`)
            .then(res => {
                const bufferedFile = Buffer.from(res.data[0].file.data.data, "base64");

                // file object
                const file = new Blob([bufferedFile], {type: 'text/plain'});

                // anchor link
                const element = document.createElement("a");
                element.href = URL.createObjectURL(file);
                element.download = fileList[index].filename;
                document.body.appendChild(element); // Required for this to work in FireFox
                element.click();
            })
            .catch(err => {
                console.log(`Error: ${err}`);
                setErrorMessage(`${err}`.substring(44) === (401).toString() ? 'request could not be sent' : `${err}`)
            });
    }

    useEffect(() => {
        fileListTop.current?.scrollIntoView({behavior: 'smooth'})
    }, [fileList])

    useMemo(() => {
        getCourseNotes();
    }, [])

    const courseNotesList = (
        <>
            <div>
                <div style={{overflow: "auto", maxHeight: `${isFilePicked ? "43vh" : "60vh"}`}}>
                    <div ref={fileListTop}/>
                    {fileList.map((file, index) => <FileCard id={index} key={index} width={'90vw'}
                                                             height={'80px'}
                                                             content={<>
                                                                 <Button style={{
                                                                     display: 'flex',
                                                                     justifyContent: 'left',
                                                                     width: '100%',
                                                                     color: 'black'
                                                                 }} onClick={() => {
                                                                     handleFileClick(index)
                                                                 }}>
                                                                     <div>
                                                                         <p style={{
                                                                             margin: "0px",
                                                                             display: 'flex',
                                                                             alignContent: 'left'
                                                                         }}>name: {file.filename}</p>
                                                                         <p style={{
                                                                             margin: "0px",
                                                                             display: 'flex',
                                                                             alignContent: 'left'
                                                                         }}>size: {file.filesize} kB</p>
                                                                         <p style={{
                                                                             margin: "0px",
                                                                             display: 'flex',
                                                                             alignContent: 'left'
                                                                         }}>uploaded: {file.createdAt.split("T")[0]}</p>
                                                                     </div>
                                                                 </Button>
                                                                 <Button
                                                                     style={{color: "black", height: '100%'}}
                                                                     onClick={() => handleDeleteCourseNotes(index)}><ClearIcon
                                                                     style={{color: '#912338'}}/></Button></>}/>)}
                </div>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "fixed",
                bottom: "30px",
                background: "white"
            }}>
                {isFilePicked ? (
                    <div>
                        <p>Filename: {selectedFile.name}</p>
                        <p>Filetype: {selectedFile.type}</p>
                        <p>Size in bytes: {selectedFile.size}</p>
                        <p>
                            lastModifiedDate:{' '}
                            {selectedFile.lastModifiedDate.toLocaleDateString()}
                        </p>
                    </div>
                ) : null}
                <div style={{marginBottom: '10px'}}>
                    <FileSelectButton width={"90vw"} onChange={handleFileSelect}/>
                </div>
                <div style={{color: 'red'}}>{errorMessage}</div>
                <div id={"uploadButton"}>
                    <PrimaryButton2 content={"Upload"} width={"90vw"} onClick={handleUploadCourseNotes}/>
                </div>
            </div>
        </>
    )

    return (
        courseNotesList
    );
}