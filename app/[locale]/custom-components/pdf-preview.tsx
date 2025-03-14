"use client"
import { Paperclip, X, Download } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { pdfjs, Document, Page } from 'react-pdf'
import { createPortal } from 'react-dom';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

type Props = {
    document?: string,
    filename?: string
}

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

const PdfPreview = ({ document = "https://cdn.prod.website-files.com/603d0d2db8ec32ba7d44fffe/603d0e327eb2748c8ab1053f_loremipsum.pdf", filename = "Estimate.pdf" }: Props) => {
    const [showPreview, setShowPreview] = useState(false);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [mounted, setMounted] = useState(false);
    const [pdfHeight, setPdfHeight] = useState(0);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const updatePdfHeight = useCallback(() => {
        setPdfHeight(window.innerHeight * 0.75);
    }, []);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            updatePdfHeight();
        }
        return () => setMounted(false);
    }, [updatePdfHeight]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleClickOutside = (event: MouseEvent) => {
            if (previewRef.current && 
                !previewRef.current.contains(event.target as Node) && 
                buttonRef.current && 
                !buttonRef.current.contains(event.target as Node)) {
                setShowPreview(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowPreview(false);
            }
        };

        if (showPreview) {
            window.document.addEventListener('mousedown', handleClickOutside);
            window.document.addEventListener('keydown', handleEscape);
            window.addEventListener('resize', updatePdfHeight);
            return () => {
                window.document.removeEventListener('mousedown', handleClickOutside);
                window.document.removeEventListener('keydown', handleEscape);
                window.removeEventListener('resize', updatePdfHeight);
            };
        }
    }, [showPreview, updatePdfHeight]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    const PreviewContent = (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
            onClick={(e) => {
                if (e.target === e.currentTarget) setShowPreview(false);
            }}
        >
            <div 
                ref={previewRef}
                className="bg-white rounded-lg p-6 max-h-[90vh] w-auto flex flex-col relative"
                style={{ minWidth: '600px', maxWidth: '90vw' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">{filename}</h2>
                    <div className="flex items-center gap-2">
                        <a
                            href={document}
                            download={filename}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                            title="Download PDF"
                        >
                            <Download className="w-5 h-5" />
                        </a>
                        <button
                            onClick={() => setShowPreview(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close preview"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                        disabled={pageNumber <= 1}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
                    >
                        ◀ Previous
                    </button>
                    <span className="text-sm font-medium px-4">
                        Page {pageNumber} of {numPages}
                    </span>
                    <button
                        onClick={() => setPageNumber((prev) => (numPages ? Math.min(numPages, prev + 1) : prev))}
                        disabled={pageNumber >= (numPages || 1)}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
                    >
                        Next ▶
                    </button>
                </div>

                <div className="overflow-auto flex-1 flex items-center justify-center bg-gray-50 rounded-md">
                    <Document 
                        file={document} 
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex items-center justify-center p-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        }
                    >
                        <Page 
                            pageNumber={pageNumber}
                            height={pdfHeight}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            loading={null}
                        />
                    </Document>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button
                ref={buttonRef}
                className='flex items-center font-semibold underline hover:text-blue-600 transition-colors'
                onClick={(e) => {
                    e.stopPropagation();
                    setShowPreview(!showPreview);
                }}
            >
                {filename} <Paperclip className="w-4 h-4 ml-2" />
            </button>
            {mounted && showPreview && typeof window !== 'undefined' && createPortal(
                PreviewContent,
                window.document.body
            )}
        </>
    )
}

export default PdfPreview