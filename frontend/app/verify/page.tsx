import React, { Suspense } from 'react'
import VerifyOtp from '../component/verifyOtp';
import Loading from '../component/loading';

const VerifyPage = () => {
    return (
        <Suspense fallback={<Loading />}>
            <VerifyOtp />
        </Suspense>
    )
}

export default VerifyPage;

// wrapp full page is suspense to use useSearch Param