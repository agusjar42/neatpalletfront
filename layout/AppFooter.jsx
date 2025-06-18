import React, { useContext, useRef, useImperativeHandle, useState, useEffect } from 'react';
import Link from "next/link";

const AppFooter = React.forwardRef((props, ref) => {
    return (
        <footer style={{
            textAlign: 'center',
            //padding: '1rem',
            background: '#f4f4f4',
            borderTop: '1px solid #ddd',
            position: 'fixed',
            width: '100%',
            bottom: 0,
        }}>

            <Link href={'/pages/legal'}>

                    Texto legal
            </Link>
        </footer>
    );
});

export default AppFooter;