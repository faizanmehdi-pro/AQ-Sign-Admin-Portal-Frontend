// import { useState, useEffect } from 'react';
// import { Document, Page } from 'react-pdf';
// import { pdfjs } from 'react-pdf';
// import styled from 'styled-components';
// import 'react-pdf/dist/Page/TextLayer.css';
// import { IoMdArrowRoundBack } from "react-icons/io";
// import pdfFile from '../../assets/ZXYQIGUA.pdf';
// import { Rnd } from 'react-rnd';
// import logo from '../../assets/images/signatureImage.png';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     'pdfjs-dist/build/pdf.worker.min.mjs',
//     import.meta.url,
// ).toString();

// const PDFViewer = ({ setFileView }) => {
//     const [numPages, setNumPages] = useState(null);
//     const [pageNumber, setPageNumber] = useState(1);
//     const [scale, setScale] = useState(1);
//     const [signatures, setSignatures] = useState([]); // Store multiple signatures
//     const [hoveredSignatureIndex, setHoveredSignatureIndex] = useState(null);

//     const onDocumentLoadSuccess = ({ numPages }) => {
//         setNumPages(numPages);
//     };

//     const goToPrevPage = () => setPageNumber((prevPage) => Math.max(1, prevPage - 1));
//     const goToNextPage = () => setPageNumber((prevPage) => Math.min(numPages, prevPage + 1));

//     const calculateScale = () => {
//         const windowWidth = window.innerWidth;
//         if (windowWidth >= 1200) {
//             setScale(0.3);
//         } else if (windowWidth >= 900) {
//             setScale(0.75);
//         } else {
//             setScale(0.4);
//         }
//     };

//     useEffect(() => {
//         calculateScale();
//         window.addEventListener('resize', calculateScale);
//         return () => window.removeEventListener('resize', calculateScale);
//     }, []);

//     // Function to add a new signature on the current page
//     const addSignature = () => {
//         setSignatures([...signatures, {
//             id: Date.now(), // Unique identifier
//             pageNumber,
//             position: { x: 50, y: 50 },
//             size: { width: 200, height: 100 }
//         }]);
//     };

//     // Function to update position and size of a specific signature
//     const updateSignature = (id, newPosition, newSize) => {
//         setSignatures(signatures.map(sig => 
//             sig.id === id ? { ...sig, position: newPosition, size: newSize } : sig
//         ));
//     };

//     // Function to remove a signature
//     const removeSignature = (id) => {
//         setSignatures(signatures.filter(sig => sig.id !== id));
//     };

//     return (
//         <>
//             <PDFTopbar>
//                 <BackButton onClick={() => setFileView(false)}>
//                     <IoMdArrowRoundBack size={22} color="#1976d2" />Go Back
//                 </BackButton>
//                 <PDFTopbarRight>
//                     <PlaceSignature onClick={addSignature}>Place Signature</PlaceSignature>
//                     <Approval>Approve</Approval>
//                 </PDFTopbarRight>
//             </PDFTopbar>
            
//             <PDFViewerWrapper>
//                 <PDFContainerSection>
//                     <PageInfo>
//                         <PageInfoButtons>
//                             <PageInfoButton onClick={goToPrevPage} disabled={pageNumber <= 1}>Prev</PageInfoButton>
//                             <h3>{pageNumber} / {numPages}</h3>
//                             <PageInfoButton onClick={goToNextPage} disabled={pageNumber >= numPages}>Next</PageInfoButton>
//                         </PageInfoButtons>
//                         <PageInfoButtons>
//                             <PageInfoButton onClick={() => setScale(Math.max(scale - 0.1, 0.1))}>-</PageInfoButton>
//                             <h3>{Math.round(scale * 100)}%</h3>
//                             <PageInfoButton onClick={() => setScale(Math.min(scale + 0.1, 2))}>+</PageInfoButton>
//                         </PageInfoButtons>
//                     </PageInfo>

//                     <PDFContainer>
//                         <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
//                             <Page scale={scale} pageNumber={pageNumber} />
//                         </Document>

//                         {/* Render only signatures that belong to the current page */}
//                         {signatures.map((signature, index) => (
//                             signature.pageNumber === pageNumber && (
//                                 <Rnd
//                                     key={signature.id}
//                                     size={signature.size}
//                                     position={signature.position}
//                                     onDragStop={(e, d) => updateSignature(signature.id, { x: d.x, y: d.y }, signature.size)}
//                                     onResizeStop={(e, direction, ref, delta, position) => {
//                                         updateSignature(signature.id, position, { width: ref.offsetWidth, height: ref.offsetHeight });
//                                     }}
//                                     onMouseEnter={() => setHoveredSignatureIndex(index)}
//                                     onMouseLeave={() => setHoveredSignatureIndex(null)}
//                                     style={{ cursor: 'move', position: 'absolute',
//                                         zIndex: hoveredSignatureIndex === index ? 10 : 4,
//                                         border: hoveredSignatureIndex === index ? '2px dotted #007BFF' : 'none', }}
//                                 >
//                                     <SignatureBox>
//                                         <img src={logo} alt="Signature" />
//                                         <EditCard>
//                                             <EditIcon onClick={() => removeSignature(signature.id)}>✖</EditIcon>
//                                         </EditCard>
//                                     </SignatureBox>
//                                 </Rnd>
//                             )
//                         ))}
//                     </PDFContainer>
//                 </PDFContainerSection>
//             </PDFViewerWrapper>
//         </>
//     );
// };

// export default PDFViewer;

// const PDFViewerWrapper = styled.div`
//     display: flex;
//     gap: 20px;
//     justify-content: center;
//     padding: 0 30px 30px 30px;
//     position: relative;
//     width: 100%;
//     height: 100%;
//     max-height: 1200px;
// `;

// const PDFContainerSection = styled.div`
//     position: relative;
//     display: flex;
//     flex-direction: column;
//     justify-content: flex-start;
//     align-items: center;
//     gap: 20px;
//     border: 1px solid #e0e0e0;
//     border-radius: 8px;
//     background-color: #f9f9f9;
//     padding: 20px;
//     width: 100%;
//     overflow: auto;
// `;

// const PDFContainer = styled.div`
//     position: relative; /* Container for PDF and overlay */
//     display: flex;
//     justify-content: center;
//     align-items: center;
// `;
// const PDFTopbar = styled.div`
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-bottom: 20px;
// `;

// const PDFTopbarRight = styled.div`
//     display: flex;
//     align-items: center;
//     gap: 10px;
// `;

// const PlaceSignature = styled.button`
//     display: flex;
//     align-items: center;
//     background: none;
//     outline: none;
//     border: 1px solid #1976d2;
//     color: #1976d2;
//     font-size: 16px;
//     font-weight: bold;
//     gap: 5px;
//     cursor: pointer;
//     padding: 10px 20px;
//     border-radius: 4px;
// `;

// const Approval = styled.button`
//     display: flex;
//     align-items: center;
//     background: #1976d2;
//     outline: none;
//     border: 1px solid #1976d2;
//     color: #fff;
//     font-size: 16px;
//     font-weight: bold;
//     gap: 5px;
//     cursor: pointer;
//     padding: 10px 20px;
//     border-radius: 4px;
// `;


// const BackButton = styled.button`
//     display: flex;
//     align-items: center;
//     background: none;
//     outline: none;
//     border: none;
//     color: #1976d2;
//     font-size: 16px;
//     font-weight: bold;
//     gap: 5px;
//     cursor: pointer;
// `;

// const EditIcon = styled.button`
//     background-color: #1976d2;
//     color: #fff;
//     border: none;
//     padding: 5px;
//     cursor: pointer;
//     border-radius: 4px;
//     transition: background-color 0.3s ease;
//     height: 30px;
//     width: 30px;
//     font-weight: bold;
// `;

// const EditCard = styled.button`
// position: absolute;
// top: -40px;
// left: 0;
// right: 0;
// background: none;
// border: none;
// display: flex;
// justify-content: flex-end;
// gap: 8px;
// z-index: 10;
// height: 50px;
// `;


// const PageInfo = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     gap: 10px;
//     color: #1976d2;
//     margin: 10px 0;
//     border: 2px solid #1976d2;
//     background: #fff;
//     padding: 10px 20px;
//     border-radius: 50px;
//     position: fixed;
//     bottom: 0;
//     z-index: 10;
//     @media screen and (max-width: 768px) {
//         flex-direction: column;
//         text-align: center;
//         gap: 20px;
//     }
// `;

// const PageInfoButton = styled.button`
//     background-color: #1976d2;
//     color: #fff;
//     border: none;
//     padding: 6px 12px;
//     margin: 0 5px;
//     cursor: pointer;
//     border-radius: 4px;
//     transition: background-color 0.3s ease;

//     &:disabled {
//         background-color: #d3d3d3;
//         cursor: not-allowed;
//     }

//     &:hover:not(:disabled) {
//         background-color: #1976d2;
//     }
// `;

// const PageInfoButtons = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     gap: 5px;
// `;
// const SignatureBox = styled.div`
//     position: relative;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 100%;
//     height: 100%;

//     img {
//         width: 100%;
//         height: 100%;
//         object-fit: contain;
//     }
// `;