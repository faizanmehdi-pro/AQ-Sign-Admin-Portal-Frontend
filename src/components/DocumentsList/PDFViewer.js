import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getDocumentImages } from "../../APIS/Documents/getDocumentImages";
import { Rnd } from "react-rnd";
import logo from "../../assets/images/signatureImage.png";
import { IoMdArrowRoundBack } from "react-icons/io";
import { updateDocument } from "../../APIS/Documents/updateDocument";
import { toast } from "react-toastify";
import { ListLoader, LoaderContainer } from "../ManageForms/ManageForm";
import { Loader } from "../Auth/LoginForm";

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    padding-bottom: 30px;
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
    justify-content: center;
    align-items: center;
    background: none;
    outline: none;
    border: 1px solid #1976d2;
    color: #1976d2;
    font-size: 16px;
    font-weight: bold;
    gap: 5px;
    cursor: pointer;
    border-radius: 4px;
    width: 160px;
    height: 45px;
`;

const Approval = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background: #1976d2;
    outline: none;
    border: 1px solid #1976d2;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    gap: 5px;
    cursor: pointer;
    border-radius: 4px;
    width: 100px;
    height: 45px;
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
    border-radius: 8px;
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
    justify-content: flex-start;
    width: 100%;
    min-height: 100vh;
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

const ImageCarousel = ({ setFileView, selectedDocumentID, selectedCustomerID, selectedSignatureImg }) => {
    console.log("img", selectedSignatureImg, selectedCustomerID)
    const queryClient = useQueryClient();
    const imageRef = React.useRef(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const [pageNumber, setPageNumber] = useState(0);
    const [signatures, setSignatures] = useState([]);
    const [hoveredSignatureIndex, setHoveredSignatureIndex] = useState(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);

    const {
        data: images = [],
        isLoading,
        isError,
        refetch,
      } = useQuery({
        queryKey: ["images", selectedDocumentID],
        queryFn: () => getDocumentImages({ docID: selectedDocumentID }),
        keepPreviousData: false,
        staleTime: 0,
      });
      

      const saveMutation = useMutation({
        mutationFn: updateDocument,
        onSuccess: () => {
          toast.success("Signatures Placed successfully!");
          refetch(); // force fresh images
          setSaveLoading(false);
          setSignatures([]);
          setFileView(false);
        },
        onError: (error) => {
          console.error("Failed to place signatures:", error);
          toast.error("Failed to place signatures. Please try again.");
          setSaveLoading(false);
        }
      });      

    const addSignature = () => {
        if (imageRef.current) {
            const width = imageRef.current.offsetWidth;
            const height = imageRef.current.offsetHeight;

            setCanvasSize({ width, height });
        }
        setSignatures([...signatures, {
            id: Date.now(), // Unique identifier
            pageNumber,
            imageId: images[pageNumber]?.id, // Add current image ID
            position: { x: 50, y: 50 },
            size: { width: 200, height: 100 },
            image: logo
        }]);
    };


    // Function to update position and size of a specific signature
    const updateSignature = (id, newPosition, newSize) => {
        setSignatures(signatures.map(sig =>
            sig.id === id ? { ...sig, position: newPosition, size: newSize } : sig
        ));
    };

    // Function to remove a signature
    const removeSignature = (id) => {
        setSignatures(signatures.filter(sig => sig.id !== id));
    };

    const handleNext = () => {
        if (pageNumber < images.length - 1 && !pageLoading) {
            setPageLoading(true);
            setTimeout(() => {
                setPageNumber(prev => prev + 1);
                setPageLoading(false);
            }, 300); // simulate load time
        }
    };
    
    const handlePrev = () => {
        if (pageNumber > 0 && !pageLoading) {
            setPageLoading(true);
            setTimeout(() => {
                setPageNumber(prev => prev - 1);
                setPageLoading(false);
            }, 300); // simulate load time
        }
    };
      


    useEffect(() => {
        if (imageRef.current) {
            setCanvasSize({
                width: imageRef.current.offsetWidth,
                height: imageRef.current.offsetHeight,
            });
        }
    }, [images, pageNumber]);

    // useEffect(() => {
    //     console.log("Updated Signatures:", signatures);
    // }, [signatures]);

    const handleSave = () => {
        setSaveLoading(true);

        const payload = {
            docID: selectedDocumentID,
            customer_id: selectedCustomerID,
            signatures: [...signatures],
            canvasSize: canvasSize,
        };

        saveMutation.mutate(payload);
    };

    const getImageSrc = (img) => {
        if (!img) return "";
        return `${img}?t=${new Date().getTime()}`; // bust browser cache
      };

    if (isLoading) return <Container><LoaderContainer><ListLoader /></LoaderContainer></Container>;
    if (isError) return <Container>Error fetching images</Container>;

    return (
        <PageContainer>
            <PDFTopbar>
                <BackButton onClick={() => setFileView(false)}>
                    <IoMdArrowRoundBack size={22} color="#1976d2" />
                    Go Back
                </BackButton>

                <PDFTopbarRight>
                    {selectedSignatureImg !== "null" ? (
                        <>
                            <PlaceSignature onClick={addSignature}>
                                Place Signature
                            </PlaceSignature>

                            <Approval onClick={handleSave} disabled={saveLoading}>
                                {saveLoading ? <Loader /> : "Save"}
                            </Approval>
                        </>
                    ) : (
                        <h5>Customer has not signed the document</h5>
                    )}
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
    {pageLoading ? (
        <LoaderContainer><ListLoader /></LoaderContainer>
    ) : (
        <>
<StyledImage
  key={images[pageNumber]?.id}
  ref={imageRef}
  src={getImageSrc(images[pageNumber]?.img)}
  alt={`Image ${images[pageNumber]?.id}`}
  onLoad={() => {
    if (imageRef.current) {
      setCanvasSize({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight,
      });
    }
  }}
/>



            {signatures.map((signature, index) => (
                signature.pageNumber === pageNumber && (
                    <Rnd
                        key={signature.id}
                        size={signature.size}
                        position={signature.position}
                        onDragStop={(e, d) => updateSignature(signature.id, { x: d.x, y: d.y }, signature.size)}
                        onResizeStop={(e, direction, ref, delta, position) => {
                            updateSignature(signature.id, position, { width: ref.offsetWidth, height: ref.offsetHeight });
                        }}
                        onMouseEnter={() => setHoveredSignatureIndex(index)}
                        onMouseLeave={() => setHoveredSignatureIndex(null)}
                        style={{
                            cursor: 'move',
                            position: 'absolute',
                            zIndex: hoveredSignatureIndex === index ? 10 : 4,
                            border: hoveredSignatureIndex === index ? '2px dotted #007BFF' : 'none',
                        }}
                    >
                        <SignatureBox>
                            <img
                                src={selectedSignatureImg}
                                alt="null"
                            />
                            {hoveredSignatureIndex === index &&
                                <EditCard>
                                    <EditIcon onClick={() => removeSignature(signature.id)}>✖</EditIcon>
                                </EditCard>
                            }
                        </SignatureBox>
                    </Rnd>
                )
            ))}
        </>
    )}
</ImageContainer>

            </Container>
        </PageContainer>
    );
};

export default ImageCarousel;

