export enum InvalidOperation {
    PairVariableSmallerThanPrimaryVariable,
    ProvidedValueNotBinary,
    RecordLengthLargerThanPossibleCombinations,
    RecordIsFull,
    RecordHasNotEnoughCapacity,
    DwaveSamplingLargerThanFourNotSupported,
    MinorEmbeddingNotSupported,
  }
  
  export enum DataFormatting {
    ListNotSquare,
    LowerTriangleEntryNotZero,
    EntryNotBinary,
    EdgeNotTwoEntries,
  }
  
  export enum DwaveApiError {
    IncorrectApiToken,
    SolverNotAvailable,
    QubitInEmbeddingNotFoundInSolverGraph,
    CouplerInEmbeddingNotFoundInSolverGraph,
    RequestReturnedCorruptedData,
  }
  
  export enum ProcessFailed {
    NoEmbeddingFound,
  }
  
  export abstract class QuboEmbedderException extends Error {
    abstract exceptionId: string;
  
    constructor(public message: string) {
      super(message);
      this.name = this.constructor.name;
    }
  
    toString(): string {
      return `${this.exceptionId}: ${this.message}`;
    }
  }
  
  export class IndexOutOfRangeException extends QuboEmbedderException {
    exceptionId = "IndexOutOfRangeException";
  
    constructor(public paramName: string) {
      super(`Parameter ${paramName} was out of range.`);
    }
  }
  
  export class InvalidOperationException extends QuboEmbedderException {
    exceptionId = "InvalidOperationException";
  
    constructor(public operation: InvalidOperation, public paramName?: string) {
      super(InvalidOperationException.createMessage(operation, paramName));
    }
  
    private static createMessage(operation: InvalidOperation, paramName?: string): string {
      switch (operation) {
        case InvalidOperation.PairVariableSmallerThanPrimaryVariable:
          return "Pair variable index must be higher or equal to the index of the primary variable.";
        case InvalidOperation.ProvidedValueNotBinary:
          return `Value '${paramName ?? ""}' for this operation must be binary.`;
        case InvalidOperation.RecordLengthLargerThanPossibleCombinations:
          return "Requested record length cannot exceed the number of possible combinations.";
        case InvalidOperation.RecordIsFull:
          return "Capacity of the record is exhausted.";
        case InvalidOperation.RecordHasNotEnoughCapacity:
          return "Capacity of the record is not large enough to add the supplied number of entries.";
        case InvalidOperation.DwaveSamplingLargerThanFourNotSupported:
          return "Using the DWave sampler on problem sizes larger than 4 is currently not supported.";
        case InvalidOperation.MinorEmbeddingNotSupported:
          return "Creating a minor embedding is not yet implemented.";
        default:
          return "Attempted to execute an invalid operation.";
      }
    }
  }
  
  export class DataFormattingException extends QuboEmbedderException {
    exceptionId = "DataFormattingException";
  
    constructor(public dataFormatError: DataFormatting) {
      super(DataFormattingException.createMessage(dataFormatError));
    }
  
    private static createMessage(dataFormatError: DataFormatting): string {
      switch (dataFormatError) {
        case DataFormatting.ListNotSquare:
          return "List for Hamiltonian must resemble a square matrix (number of columns = number of rows).";
        case DataFormatting.LowerTriangleEntryNotZero:
          return "Entries in the lower triangle of the list must be zero.";
        case DataFormatting.EntryNotBinary:
          return "Entries can be either 0 or 1 (binary).";
        case DataFormatting.EdgeNotTwoEntries:
          return "Graph edges as List<int> must have exactly two entries (i.e. the two nodes the edge connects).";
        default:
          return "Provided incorrectly formatted data.";
      }
    }
  }
  
  export class DwaveApiException extends QuboEmbedderException {
    exceptionId = "DwaveApiException";
  
    constructor(public dwaveApiError: DwaveApiError) {
      super(DwaveApiException.createMessage(dwaveApiError));
    }
  
    private static createMessage(dwaveApiError: DwaveApiError): string {
      switch (dwaveApiError) {
        case DwaveApiError.IncorrectApiToken:
          return "Provided API key is incorrect, nonexistent or does not authorize for the usage of the DWave API.";
        case DwaveApiError.SolverNotAvailable:
          return "Provided solver is currently offline or does not exist.";
        case DwaveApiError.QubitInEmbeddingNotFoundInSolverGraph:
          return "Discrepancy in provided solver graph and embedding; physical qubit present in embedding could not be found in the solver graph.";
        case DwaveApiError.CouplerInEmbeddingNotFoundInSolverGraph:
          return "Discrepancy in provided solver graph and embedding; coupler referenced in embedding could not be found in the solver graph.";
        case DwaveApiError.RequestReturnedCorruptedData:
          return "Solution requested from the API contains corrupted data that could not be parsed to solution record entries.";
        default:
          return "Dwave API failed.";
      }
    }
  }
  
  export class NetworkException extends QuboEmbedderException {
    exceptionId = "NetworkException";
  
    constructor(public statusCode: number, public msg?: string) {
      super(
        `Request to the REST API returned status code (${statusCode}). ${
          msg == null || msg.length === 0 ? "No message." : `Message:\n${msg}`
        }`
      );
    }
  }
  
  export class RequiredArgumentNullException extends QuboEmbedderException {
    exceptionId = "RequiredArgumentNullException";
  
    constructor(public paramName: string) {
      super(`Required argument '${paramName}' must not be null.`);
    }
  }
  
  export class ProcessFailedException extends QuboEmbedderException {
    exceptionId = "ProcessFailedException";
  
    constructor(public failedProcess: ProcessFailed) {
      super(ProcessFailedException.createMessage(failedProcess));
    }
  
    private static createMessage(failedProcess: ProcessFailed): string {
      switch (failedProcess) {
        case ProcessFailed.NoEmbeddingFound:
          return "Embedding for submitted problem could not be found or the submitted problem is empty.";
        default:
          return "An internal process failed.";
      }
    }
  }
  