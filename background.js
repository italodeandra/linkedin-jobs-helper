let [ getAppliedJobs, setAppliedJobs ] = createState('appliedJobs', [])

/**
 * Creates a state
 * @param {string} name
 * @param {*=} defaultValue
 * @return {Array} [ getState, setState ]
 */
function createState(name, defaultValue) {
    let localStorageItem = localStorage.getItem(name)
    let state = localStorageItem ? JSON.parse(localStorageItem) : defaultValue

    function setState(value) {
        localStorage.setItem(name, JSON.stringify(value))
        state = value
    }

    function getState() {
        return state
    }

    return [ getState, setState ]
}

/**
 * Get URL params
 * @return {Object} params
 */
function getURLParams() {
    let paramsString = window.location.search
    return new URLSearchParams(paramsString)
}

/**
 * Check if the current job was already applied for
 * @return {boolean} is applied
 */
function isCurrentJobApplied() {
    let params = getURLParams()

    if (params.has('currentJobId')) {
        return !!document.querySelector('[data-control-name="jobs_save_button__unsave"],.jobs-s-apply__applied-date')
    } else {
        return false
    }
}

/**
 * Add current job to applied jobs if it was already applied for
 */
function checkCurrentJob() {
    if (isCurrentJobApplied()) {
        let params = getURLParams()
        let currentJobId = params.get('currentJobId')

        let newAppliedJobs = getAppliedJobs()
        if (!newAppliedJobs.includes(currentJobId)) {
            console.info(`[Helper] Adding new job ${currentJobId} to applied list`)

            newAppliedJobs.push(currentJobId)
            setAppliedJobs(newAppliedJobs)
        }
    }
}

/**
 * Hide applied jobs from list
 */
function hideAppliedJobs() {
    for (let appliedJob of getAppliedJobs()) {
        let element = document.querySelector(`[data-job-id="urn:li:fs_normalized_jobPosting:${appliedJob}"]`)
        if (element && element.style.display !== 'none') {
            console.info(`[Helper] Hiding job ${appliedJob}`)
            element.style.display = 'none'
        }
    }
}

/**
 * Interval of the helper
 */
function helperInterval() {
    checkCurrentJob()
    hideAppliedJobs()
}

clearInterval(helperInterval)
setInterval(helperInterval, 1000)
