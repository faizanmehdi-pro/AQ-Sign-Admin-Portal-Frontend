import React, { useState } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getDocumentImages } from "../../APIS/Documents/getDocumentImages";
import { Rnd } from "react-rnd";
import logo from "../../assets/images/signatureImage.png";
import { IoMdArrowRoundBack } from "react-icons/io";

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
`;

const PDFTopbar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const PDFTopbarRight = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const PlaceSignature = styled.button`
    display: flex;
    align-items: center;
    background: none;
    outline: none;
    border: 1px solid #1976d2;
    color: #1976d2;
    font-size: 16px;
    font-weight: bold;
    gap: 5px;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 4px;
`;

const Approval = styled.button`
    display: flex;
    align-items: center;
    background: #1976d2;
    outline: none;
    border: 1px solid #1976d2;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    gap: 5px;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 4px;
`;


const BackButton = styled.button`
    display: flex;
    align-items: center;
    background: none;
    outline: none;
    border: none;
    color: #1976d2;
    font-size: 16px;
    font-weight: bold;
    gap: 5px;
    cursor: pointer;
`;

const EditIcon = styled.button`
    background-color: #1976d2;
    color: #fff;
    border: none;
    padding: 5px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    height: 30px;
    width: 30px;
    font-weight: bold;
`;

const EditCard = styled.button`
position: absolute;
top: -40px;
left: 0;
right: 0;
background: none;
border: none;
display: flex;
justify-content: flex-end;
gap: 8px;
z-index: 10;
height: 50px;
`;


const SignatureBox = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const PageInfo = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: #1976d2;
    margin: 10px 0;
    border: 2px solid #1976d2;
    background: #fff;
    padding: 10px 20px;
    border-radius: 50px;
    position: fixed;
    bottom: 0;
    z-index: 10;
    @media screen and (max-width: 768px) {
        flex-direction: column;
        text-align: center;
        gap: 20px;
    }
`;

const PageInfoButton = styled.button`
    background-color: #1976d2;
    color: #fff;
    border: none;
    padding: 6px 12px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    &:disabled {
        background-color: #d3d3d3;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        background-color: #1976d2;
    }
`;

const PageInfoButtons = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background-color: #f4f4f4;
    padding: 20px;
`;

const ImageContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

const StyledImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

const ButtonContainer = styled.div`
    margin-top: 20px;
    display: flex;
    gap: 20px;
    align-items: center;
`;

const Button = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    transition: background 0.3s;

    &:hover {
        background-color: #0056b3;
    }
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const Counter = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: #333;
`;

const ImageCarousel = ({ setFileView, selectedDocumentID }) => {
    const { data: images = [], isLoading, isError } = useQuery({
        queryKey: ["images"],
        queryFn: () => getDocumentImages({ docID: selectedDocumentID }), // Pass as an object
        keepPreviousData: false,
    });

    const [pageNumber, setPageNumber] = useState(0);
    const [signatures, setSignatures] = useState([]);
    const [hoveredSignatureIndex, setHoveredSignatureIndex] = useState(null);

    const addSignature = () => {
        setSignatures([
            ...signatures,
            {
                id: Date.now(),
                pageNumber,
                position: { x: 50, y: 50 },
                size: { width: 200, height: 100 },
            },
        ]);
    };

    const updateSignature = (id, newPosition, newSize) => {
        setSignatures((prevSignatures) =>
            prevSignatures.map((sig) =>
                sig.id === id
                    ? { ...sig, position: newPosition, size: newSize }
                    : sig
            )
        );
    };

    const removeSignature = (id) => {
        setSignatures((prevSignatures) =>
            prevSignatures.filter((sig) => sig.id !== id)
        );
    };

    const handleNext = () => {
        if (pageNumber < images.length - 1) setPageNumber(pageNumber + 1);
    };

    const handlePrev = () => {
        if (pageNumber > 0) setPageNumber(pageNumber - 1);
    };

    const generateSignedImage = async (imageSrc, signatures) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = imageSrc;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
    
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
                let loadedSignatures = 0;
                const relevantSignatures = signatures.filter(sig => sig.pageNumber === pageNumber);
    
                if (relevantSignatures.length === 0) {
                    return resolve(canvas.toDataURL("image/png"));
                }
    
                relevantSignatures.forEach((sig) => {
                    const signatureImg = new Image();
                    signatureImg.src = logo;
                    signatureImg.onload = () => {
                        ctx.drawImage(
                            signatureImg,
                            sig.position.x,
                            sig.position.y,
                            sig.size.width,
                            sig.size.height
                        );
    
                        loadedSignatures++;
    
                        if (loadedSignatures === relevantSignatures.length) {
                            resolve(canvas.toDataURL("image/png"));
                        }
                    };
                });
            };
        });
    };
    
    

    const uploadImage = async (base64Image) => {
        const formData = new FormData();
        formData.append("file", base64ToBlob(base64Image));

        try {
            const response = await axios.post(`http://98.81.159.86/UpdateDocument/${selectedDocumentID}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data.url;
        } catch (error) {
            console.error("Upload failed:", error);
            return null;
        }
    };

    const base64ToBlob = (base64) => {
        const byteCharacters = atob(base64.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length).map((_, i) =>
            byteCharacters.charCodeAt(i)
        );
        return new Blob([new Uint8Array(byteNumbers)], { type: "image/png" });
    };

    const saveSignedImage = async () => {
        const token = localStorage.getItem("authToken"); // Ensure you have a valid token
    
        const updatedImages = await Promise.all(
            images.map(async (image) => {
                const relevantSignatures = signatures.filter(sig => sig.pageNumber === image.id);
                
                if (relevantSignatures.length === 0) {
                    return { id: image.id, img: image.img };
                }
    
                const signedImage = await generateSignedImage(image.img, relevantSignatures);
                const uploadedImageUrl = await uploadImage(signedImage);
    
                return { 
                    id: image.id, 
                    img: uploadedImageUrl || image.img 
                };
            })
        );
    
        console.log("Final Payload:", JSON.stringify({ updatedImages }, null, 2));
    
        try {
            const response = await axios.patch(
                `http://98.81.159.86/UpdateDocument/${selectedDocumentID}/`,
                updatedImages,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            console.log("Response:", response.data);
            alert("Signatures saved successfully!");
        } catch (error) {
            console.error("Error saving signatures:", error.response?.data || error.message);
            alert("Failed to save signatures.");
        }
    };
    
    
    

    if (isLoading) return <PageContainer>Loading...</PageContainer>;
    if (isError) return <PageContainer>Error fetching images</PageContainer>;

    return (
        <PageContainer>
            <PDFTopbar>
                <BackButton onClick={() => setFileView(false)}>
                    <IoMdArrowRoundBack size={22} color="#1976d2" />
                    Go Back
                </BackButton>
                <PDFTopbarRight>
                    <PlaceSignature onClick={addSignature}>
                        Place Signature
                    </PlaceSignature>
                    <Approval onClick={saveSignedImage}>Save</Approval>
                </PDFTopbarRight>
            </PDFTopbar>
            <Container>                
                <PageInfo>
                    <PageInfoButtons>
                        <PageInfoButton onClick={handlePrev} disabled={pageNumber === 0}>Prev</PageInfoButton>
                        <h3>{pageNumber + 1} / {images.length}</h3>
                        <PageInfoButton onClick={handleNext} disabled={pageNumber === images.length - 1}>Next</PageInfoButton>
                    </PageInfoButtons>
                </PageInfo>
                <ImageContainer>
                    {/* <StyledImage 
                        src={images[pageNumber]?.img}
                        alt={`Image ${images[pageNumber]?.id}`}
                    /> */}
                    <StyledImage 
        src={images.slice().reverse()[pageNumber]?.img} 
        alt={`Image ${images.slice().reverse()[pageNumber]?.id}`} 
    />
                    {signatures.map(
                        (signature, index) =>
                            signature.pageNumber === pageNumber && (
                                <Rnd
                                    key={signature.id}
                                    size={signature.size}
                                    position={signature.position}
                                    onDragStop={(e, d) =>
                                        updateSignature(
                                            signature.id,
                                            { x: d.x, y: d.y },
                                            signature.size
                                        )
                                    }
                                    onResizeStop={(
                                        e,
                                        direction,
                                        ref,
                                        delta,
                                        position
                                    ) => {
                                        updateSignature(signature.id, position, {
                                            width: ref.offsetWidth,
                                            height: ref.offsetHeight,
                                        });
                                    }}
                                    onMouseEnter={() =>
                                        setHoveredSignatureIndex(index)
                                    }
                                    onMouseLeave={() =>
                                        setHoveredSignatureIndex(null)
                                    }
                                    style={{
                                        cursor: "move",
                                        position: "absolute",
                                        zIndex:
                                            hoveredSignatureIndex === index
                                                ? 10
                                                : 4,
                                        border:
                                            hoveredSignatureIndex === index
                                                ? "2px dotted #007BFF"
                                                : "none",
                                    }}
                                >
                                    <SignatureBox>
                                        <img src={logo} alt="Signature" />
                                        {hoveredSignatureIndex === index && (
                                            <EditCard>
                                                <EditIcon
                                                    onClick={() =>
                                                        removeSignature(
                                                            signature.id
                                                        )
                                                    }
                                                >
                                                    ✖
                                                </EditIcon>
                                            </EditCard>
                                        )}
                                    </SignatureBox>
                                </Rnd>
                            )
                    )}
                </ImageContainer>
            </Container>
        </PageContainer>
    );
};

export default ImageCarousel;

