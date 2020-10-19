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

  var test_handler = new stream.Writable({
    write: function(chunk, encoding, next) {
      console.log("LINE: " + chunk.toString());
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
        }
    
      })
    }
    function onProgress(event) {}

  });

} catch (error) {
  core.setFailed(error.message);
}