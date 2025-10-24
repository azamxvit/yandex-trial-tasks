const makePreparation = (artefactAgesHistogram, periodDuration) => {
    return {
        periodDuration
    };
};

const seekPeriodIndicies = (analyseArtefact, startIndex, options) => {
    const { periodDuration } = options;

    const first = analyseArtefact(startIndex);
    let start = first.start;
    let end = first.end;
    let endIndex = startIndex;

    while (true) {
        const nextIndex = endIndex + 1;
        try {
            const next = analyseArtefact(nextIndex);
            const nextEnd = next.end;

            if (nextEnd - start > periodDuration) break;

            end = nextEnd;
            endIndex = nextIndex;
        } catch {
            break;
        }
    }

    const actualDuration = end - start;
    return [startIndex, endIndex, actualDuration];
};

module.exports = {
    makePreparation,
    seekPeriodIndicies
};
