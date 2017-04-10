<?php


header("Access-Control-Allow-Origin: *");

    $fileName = $_POST['video-filename'];
    $tempName = $_FILES['video-blob']['tmp_name'];
    
    if (empty($fileName) || empty($tempName)) {
        echo 'PermissionDeniedError';
        return;
    }

    $filePath = 'uploads/' . $fileName;
    
    // make sure that one can upload only allowed audio/video files
    $allowed = array(
        'webm',
        'wav',
        'mp4',
        'mp3',
        'ogg'
    );

    $extension = pathinfo($filePath, PATHINFO_EXTENSION);
    if (!$extension || empty($extension) || !in_array($extension, $allowed)) {
        echo 'PermissionDeniedError';
        continue;
    }
    
    if (!move_uploaded_file($tempName, $filePath)) {
        echo ('Problem saving file.');
        return;
    }
    
    $mp4 = convertToMp4($filePath);
    echo $mp4;

    //covert .webm to .mp4
    function convertToMp4($url) {
      $fileName = basename($url, ".mp4");

      $output = "output/" . $fileName . ".mp4";

      $str = 'ffmpeg -i ' . $url . ' -vcodec h264 -acodec aac -strict -2 ' . $output;

      shell_exec($str);
      
      return $output;
    }

    


  
  /*
  $vc = "input/VC.mp4";
  $json = '{"videos": [{"url": "input/video1.mp4", "start": 0, "end": -1, "position": 5}, {"url": "input/video2.mp4", "start": 5, "end": 10, "position": 20}], "audios": [{"url": "audio1.mp3", "start": 0, "end": 10, "position" : 0}] }';
  $obj = json_decode($json, true);

  $videos = $obj['videos'];
  $audios = $obj['audios'];
  
  //extract and merge video 
  $step = 0;
  $final = $vc;

  //merge video
  while($step < count($videos)) {
    
    $extract = extractAudioFromVideo($videos[$step]['url']);
    
    $cut = cutAudioByStartAndEnd($extract, $videos[$step]['start'], $videos[$step]['end']);

    $final = mergeAudioAndVideo($final, $cut, $videos[$step]['position']);
    
    $step ++;
  }

  print_r('|' .  $final . '|');

  //merge audio
  $step = 0;
  while($step < count($audios)) {
    $cut = cutAudioByStartAndEnd($audios[$step]['url'], $audios[$step]['start'], $audios[$step]['end']);

    $final = mergeAudioAndVideo($final, $cut, $audios[$step]['position']);
    
    $step ++;
  }

  print_r('|' .  $final . '|');

  //utils function
  function extractAudioFromVideo($url) {
    $fileName = basename($url, ".mp4");

    $output = "output/" . $fileName . ".mp3";

    shell_exec("ffmpeg -i " . $url . " -f mp3 -ab 192000 -vn " . $output);
    
    return $output;
  }

  function cutAudioByStartAndEnd($audio, $start, $end) {
    if ($start == 0 && $end == - 1) {
      return $audio;
    }

    $fileName = basename($audio, ".mp3");

    $output = "output/" . $fileName . "_cut.mp3";

    shell_exec("ffmpeg -ss " . $start . " -t " . ($end - $start) ." -i " . $audio . " " . $output);

    return $output;
  }

  function mergeAudioAndVideo($video, $audio, $position) {

    $output = "output/videofinal_" . $position . ".mp4";

    $str = "ffmpeg -i " . $video . " -itsoffset " . $position . " -i " . $audio . " -acodec copy -vcodec copy -copyts " . $output;

    shell_exec($str);
    
    return  $output;
  }
  */
?>
