export const PYTHON_IMAGE = "python:3.8-slim";
export const JAVA_IMAGE = "openjdk:11-jdk-slim";
export const CPP_IMAGE = "gcc:latest";

// Represents the header size of the docker stream
// Docker stream header will contain data about type of stream i.e. stdout/stderr
// and the length of the data.
export const DOCKER_STREAM_HEADER_SIZE = 8;

export const SUBMISSION_QUEUE = "SubmissionQueue";
export const SUBMISSION_JOB = "SubmissionJob";