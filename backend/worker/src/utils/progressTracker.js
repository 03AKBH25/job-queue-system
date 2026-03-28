import {updateJobProgress} from './progressHelper.js';

export const createProgressTracker = (jobId, totalSteps) =>{
    let currentStep = 0;

    return async () => {
        currentStep++;

        const progress = Math.round((currentStep / totalSteps) * 100);
        await updateJobProgress(jobId, progress);
    }
} 