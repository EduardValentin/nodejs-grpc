var PROTO_PATH = __dirname + "/service.proto";
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

// Suggested options for similarity to existing grpc.load behavior
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});

var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

function getServer() {
	var server = new grpc.Server();
	server.addService(
		protoDescriptor.com.example.v1.graphql.ExampleService.service,
		{
			createExample: (call, callback) => {
				console.log("Received", call.request);
				return callback(null, call.request);
			},
		}
	);
	return server;
}
const PORT = process.env.PORT || 50051;
var server = getServer();
server.bindAsync(
	`localhost:${PORT}`,
	grpc.ServerCredentials.createInsecure(),
	() => {
		console.log("server started on port: " + PORT);
		server.start();
	}
);
