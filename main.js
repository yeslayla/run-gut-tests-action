const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const stream = require('stream');

// Setup Docker
const Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

try {

  // Get inputs
  var docker_image = core.getInput('containerImage');
  var work_dir = core.getInput('directory');

  if(work_dir)
  {
    process.chdir(work_dir);
  }

  let script_errors = [];

  // Test handler stream
  var test_handler = new stream.Writable({
    write: function(chunk, encoding, next) {

      // Check for script errors
      let re = new RegExp("SCRIPT ERROR: ?([^']+)'?:", "i")
      var match = re.exec(chunk.toString());
      if (match) {
        script_errors.push(match[0]);
      }

      // Print to stdout
      console.log(chunk.toString());
      next();
    }
  });

  // Pull docker image for building
  console.log("Pulling build image...");
  docker.pull(docker_image, function(err, stream)
  {

    docker.modem.followProgress(stream, onFinished, onProgress);

    // Wait to run build until after pull complete
    function onFinished(err, output)
    {
      console.log("Starting image...");
      docker.run(docker_image, ['godot', '-d', '-s', '--path', '/project', 'addons/gut/gut_cmdln.gd'], test_handler, 
      
      // Mount working directory to `/project`
      { HostConfig: { Binds: [ process.cwd() + ":/project" ] }},
      
      function (err, data, container) {

        if(err)
        {
          core.setFailed(error.message);
        }

        console.log("Tests exited with status: " + data.StatusCode);

        if( data.StatusCode != "0" )
        {
            core.setFailed("GUT tests failed!");
        } else if (script_errors.length > 0) // Check for script errors
        {
          // Fail action
          core.setFailed(script_errors.length.toString() + " script errors were found!");
          
          // Log script errors
          console.log("The following scripts had script errors:")
          script_errors.forEach(error => {
            console.log(error)
          });

        }
    
      })
    }
    function onProgress(event) {}

  });

} catch (error) {
  core.setFailed(error.message);
}