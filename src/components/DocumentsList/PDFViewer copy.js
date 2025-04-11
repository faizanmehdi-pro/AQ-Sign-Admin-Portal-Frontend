import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Rnd } from "react-rnd";
import logo from "../../assets/images/signatureImage.png";
import image1 from "../../assets/images/image.png";
import image2 from "../../assets/images/image1.png";
import image3 from "../../assets/images/image2.png";

const images = [image1, image2, image3];

const ImageViewer = ({ setFileView }) => {
    const canvasRef = useRef(null);
    const imageRef = useRef(new Image());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [image, setImage] = useState(null);
    const [signaturesByImage, setSignaturesByImage] = useState({});
    const [hoveredSignatureIndex, setHoveredSignatureIndex] = useState(null);
    const [scale, setScale] = useState(1); // Controls image size

    useEffect(() => {
        loadImage(images[currentIndex]);
    }, [currentIndex]);

    useEffect(() => {
        drawImage();
    }, [image, signaturesByImage, scale]);

    const loadImage = (imageSrc) => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            setImage(img);
        };
        imageRef.current = img;
    };

    const drawImage = () => {
        const canvas = canvasRef.current;
        if (!canvas || !image) return;

        const ctx = canvas.getContext("2d");
        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;

        canvas.width = scaledWidth;
        canvas.height = scaledHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);

        const signatures = signaturesByImage[currentIndex] || [];
        signatures.forEach((signature) => {
            const sigImage = new Image();
            sigImage.src = logo;
            sigImage.onload = () => {
                ctx.drawImage(sigImage, signature.x * scale, signature.y * scale, signature.width * scale, signature.height * scale);
            };
        });
    };

    const addSignature = () => {
        setSignaturesByImage((prev) => ({
            ...prev,
            [currentIndex]: [...(prev[currentIndex] || []), { id: Date.now(), x: 50, y: 50, width: 200, height: 100 }],
        }));
    };

    const updateSignature = (id, x, y, width, height) => {
        setSignaturesByImage((prev) => ({
            ...prev,
            [currentIndex]: prev[currentIndex]?.map((sig) =>
                sig.id === id ? { ...sig, x, y, width, height } : sig
            ),
        }));
    };

    const removeSignature = (id) => {
        setSignaturesByImage((prev) => ({
            ...prev,
            [currentIndex]: prev[currentIndex]?.filter((sig) => sig.id !== id),
        }));
    };

    const saveImage = () => {
        Object.keys(signaturesByImage).forEach((index) => {
            const img = new Image();
            img.src = images[index];
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                signaturesByImage[index]?.forEach((signature) => {
                    const sigImage = new Image();
                    sigImage.src = logo;
                    sigImage.onload = () => {
                        ctx.drawImage(sigImage, signature.x * scale, signature.y * scale, signature.width * scale, signature.height * scale);

                        setTimeout(() => {
                            const link = document.createElement("a");
                            link.href = canvas.toDataURL("image/png");
                            link.download = `signed_image_${index}.png`;
                            link.click();
                        }, 500);
                    };
                });
            };
        });
    };

    const nextImage = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const prevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    const increaseSize = () => {
        setScale((prev) => Math.min(prev + 0.1, 2)); // Max zoom: 2x
    };

    const decreaseSize = () => {
        setScale((prev) => Math.max(prev - 0.1, 0.1)); // Min zoom: 0.5x
    };

    return (
        <PageContainer>
                    <PDFTopbar>
                        <BackButton onClick={() => setFileView(false)}>
                            <IoMdArrowRoundBack size={22} color="#1976d2" />Go Back
                        </BackButton>
                        <PDFTopbarRight>
                            <PlaceSignature onClick={addSignature}>Place Signature</PlaceSignature>
                            <Approval onClick={saveImage}>Approve</Approval>
                        </PDFTopbarRight>
                    </PDFTopbar>

            <CanvasContainer>
                <PageInfo>
                    <PageInfoButtons>
                        <PageInfoButton onClick={prevImage} disabled={currentIndex === 0}>Prev</PageInfoButton>
                        <h3>{currentIndex + 1} / {images.length}</h3>
                        <PageInfoButton onClick={nextImage} disabled={currentIndex === images.length - 1}>Next</PageInfoButton>
                    </PageInfoButtons>
                    <PageInfoButtons>
                        <PageInfoButton onClick={decreaseSize} disabled={scale <= 0.1}>-</PageInfoButton>
                        <h3>{Math.round(scale * 100)}%</h3>
                        <PageInfoButton onClick={increaseSize} disabled={scale >= 2}>+</PageInfoButton>
                    </PageInfoButtons>
                </PageInfo>
                <CanvasImageContainer>
                    <canvas ref={canvasRef} />
                    {(signaturesByImage[currentIndex] || []).map((signature, index) => (
                        <Rnd
                            key={signature.id}
                            size={{ width: signature.width * scale, height: signature.height * scale }}
                            position={{ x: signature.x * scale, y: signature.y * scale }}
                            onDragStop={(e, d) => updateSignature(signature.id, d.x / scale, d.y / scale, signature.width, signature.height)}
                            onResizeStop={(e, direction, ref, delta, position) =>
                                updateSignature(signature.id, position.x / scale, position.y / scale, ref.offsetWidth / scale, ref.offsetHeight / scale)
                            }
                                onMouseEnter={() => setHoveredSignatureIndex(index)}
                                onMouseLeave={() => setHoveredSignatureIndex(null)}
                            style={{
                                cursor: "move",
                                position: "absolute",
                                zIndex: hoveredSignatureIndex === index ? 10 : 4,
                                border: hoveredSignatureIndex === index ? "2px dotted #007BFF" : "none",
                            }}
                        >
                            <SignatureBox>
                                <img src={logo} alt="Signature" />
                                {hoveredSignatureIndex === index && (
                                    <EditCard>
                                        <EditIcon onClick={() => removeSignature(signature.id)}>✖</EditIcon>
                                    </EditCard>
                                )}
                            </SignatureBox>
                        </Rnd>
                    ))}
                </CanvasImageContainer>
            </CanvasContainer>
        </PageContainer>
    );
};

export default ImageViewer;

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const CanvasContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9f9f9;
    padding: 20px;
`;

const CanvasImageContainer = styled.div`
    position: relative;
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