import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import styled from "styled-components";
import { IoMdArrowRoundBack } from "react-icons/io";
import pdfFile from "../../assets/ZXYQIGUA.pdf";
import { Rnd } from 'react-rnd';
import logo from '../../assets/images/signatureImage.png';
import { Loader } from "../Auth/LoginForm";


const PDFViewer = ({ setFileView }) => {
    const canvasRef = useRef(null);
    const renderTaskRef = useRef(null); // Ref to track the current render task
    const [pdfDoc, setPdfDoc] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1);
    const [isRendering, setIsRendering] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const [signatures, setSignatures] = useState([]); // Store multiple signatures
    const [hoveredSignatureIndex, setHoveredSignatureIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loader state

    useEffect(() => {
        const loadPdf = async () => {
            try {
                setIsLoading(true);
                const loadingTask = pdfjsLib.getDocument(pdfFile);
                const pdf = await loadingTask.promise;
                setPdfDoc(pdf);
                setNumPages(pdf.numPages);
                renderPage(pdf, pageNumber, scale);
            } catch (error) {
                console.error("Error loading PDF:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPdf();
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return; // Ensure canvas is available
        if (pdfDoc) {
            renderPage(pdfDoc, pageNumber, scale);
        }
    }, [pdfDoc, pageNumber, scale]);
    

    useEffect(() => {
        const handleResize = () => {
            if (pdfDoc) {
                renderPage(pdfDoc, pageNumber, scale);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [pdfDoc, pageNumber, scale]);

    const renderPage = async (pdf, pageNum, scaleFactor) => {
        if (isRendering) return; // Prevent overlapping renders
        setIsRendering(true);
    
        const page = await pdf.getPage(pageNum);
        const canvas = canvasRef.current;
    
        if (!canvas) {
            console.warn("Canvas not available yet.");
            setIsRendering(false);
            return;
        }
    
        const context = canvas.getContext("2d");
        if (!context) {
            console.error("Failed to get canvas context");
            setIsRendering(false);
            return;
        }
    
        if (renderTaskRef.current) {
            renderTaskRef.current.cancel();
        }
    
        const screenWidth = window.innerWidth * 0.43;
        const viewport = page.getViewport({ scale: 1 });
        const computedScale = scaleFactor * (screenWidth / viewport.width);
        const scaledViewport = page.getViewport({ scale: computedScale });
    
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
    
        const renderContext = {
            canvasContext: context,
            viewport: scaledViewport,
        };
    
        try {
            renderTaskRef.current = page.render(renderContext);
            await renderTaskRef.current.promise;
        } catch (error) {
            console.warn("Render task was cancelled.");
        } finally {
            setIsRendering(false);
        }
    };
    
    const zoomIn = () => {
        setScale((prevScale) => Math.min(prevScale + 0.1, 1.5)); // Max zoom level: 3x
    };

    const zoomOut = () => {
        setScale((prevScale) => Math.max(prevScale - 0.1, 0.1)); // Min zoom level: 0.5x
    };

    // Function to add a new signature on the current page
    const addSignature = () => {
        setSignatures([...signatures, {
            id: Date.now(), // Unique identifier
            pageNumber,
            position: { x: 50, y: 50 },
            size: { width: 200, height: 100 }
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

    return (
        <PageContainer>
            <PDFTopbar>
                <BackButton onClick={() => setFileView(false)}>
                    <IoMdArrowRoundBack size={22} color="#1976d2" />Go Back
                </BackButton>
                <PDFTopbarRight>
                    <PlaceSignature onClick={addSignature}>Place Signature</PlaceSignature>
                    <Approval>Approve</Approval>
                </PDFTopbarRight>
            </PDFTopbar>

            <PDFContainerSection>
                <PageInfo>
                    <PageInfoButtons>
                        <PageInfoButton
                            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                            disabled={pageNumber <= 1}>Prev</PageInfoButton>
                        <h3>{pageNumber} / {pdfDoc?.numPages}</h3>
                        <PageInfoButton
                            onClick={() => setPageNumber((prev) => Math.min(prev + 1, pdfDoc?.numPages || 1))}
                            disabled={pageNumber >= (pdfDoc?.numPages || 1)}>Next</PageInfoButton>
                    </PageInfoButtons>
                    <PageInfoButtons>
                        <PageInfoButton onClick={zoomOut} disabled={scale <= 0.1}>-</PageInfoButton>
                        <h3>{Math.round(scale * 100)}%</h3>
                        <PageInfoButton onClick={zoomIn} disabled={scale >= 1.5}>+</PageInfoButton>
                    </PageInfoButtons>
                </PageInfo>
                <PDFContainer>
                {isLoading ? (
                    <h1>Loading PDF...</h1>
                ) : (
                    <canvas ref={canvasRef}></canvas>
                    
                )
            }

                
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
                                    cursor: 'move', position: 'absolute',
                                    zIndex: hoveredSignatureIndex === index ? 10 : 4,
                                    border: hoveredSignatureIndex === index ? '2px dotted #007BFF' : 'none',
                                }}
                            >
                                <SignatureBox>
                                    <img src={logo} alt="Signature" />
                                    {hoveredSignatureIndex === index &&
                                    <EditCard>
                                        <EditIcon onClick={() => removeSignature(signature.id)}>✖</EditIcon>
                                    </EditCard>
}
                                </SignatureBox>
                            </Rnd>
                        )
                    ))}
                </PDFContainer>
            </PDFContainerSection>
        </PageContainer>
    );
};

export default PDFViewer;

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
`;

const PDFContainerSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #f9f9f9;
    padding: 20px;
    position: relative;
    height: 100%;
`;

const PDFContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;
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