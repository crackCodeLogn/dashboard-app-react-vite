rm generated/$1.ts
protoc --plugin=protoc-gen-ts=$(which protoc-gen-ts) --ts_out=generated $1.proto
