#!/usr/bin/env zx



async function main() {
  try {
    // intro with ASCII art and color
    console.log(`
    \x1b[36m
  First time setup CLI Tool
  https://github.com/froy-bookips/firset
       ______________  _____ ____________
      / ____/  _/ __ \\/ ___// ____/_  __/
     / /_   / // /_/ /\\__ \\/ __/   / /   
    / __/ _/ // _, _/___/ / /___  / /    
   /_/   /___/_/ |_|/____/_____/ /_/    
   
   This script will generate an SSH key and register it with GitHub.
    \x1b[0m
    `);

    // input username
    const username = await question("• please enter your github username: ");


    // get email
    const email = await question("• please enter your github username: ");

    // set git config
    await $`git config --global user.name ${username}`.catch((err) => {
      console.error("Error setting git username:", err);
      process.exit(1);
    }
    );
    await $`git config --global user.email ${email}`.catch((err) => {
      console.error("Error setting git email:", err);
      process.exit(1);
    }
    );

    // Check if GitHub CLI is installed
    await $`which gh`.catch(() => {
      console.log("Installing GitHub CLI...");
      if (process.platform === "linux") {
        $`sudo apt-get install gh`.catch(() => {
          console.error("Failed to install GitHub CLI on Linux.");
          process.exit(1);
        });
      } else if (process.platform === "darwin") {
        $`brew install gh`.catch(() => {
          console.error("Failed to install GitHub CLI on macOS.");
          process.exit(1);
        });
      } else {
        console.error("Unsupported platform for automatic installation of GitHub CLI.");
        process.exit(1);
      }
    });

    // Github login
    await $`gh auth login -h github.com -s admin:public_key`.catch((err) => {
      console.error("Error logging into GitHub:", err);
      process.exit(1);
    });
    
    // gh auth refresh -h github.com -s admin:public_key
    await $`gh auth refresh -h github.com -s admin:public_key`.catch((err) => {
      console.error("Error refreshing GitHub auth:", err);
      process.exit(1);
    });

    // Generate SSH key
    const keyPath = `${os.homedir()}/.ssh/id_rsa`;
    await $`ssh-keygen -t rsa -b 4096 -f ${keyPath} -N ''`.catch((err) => {
      console.error("Error generating SSH key:", err);
      process.exit(1);
    });

    // Register SSH key with GitHub
    await $`gh ssh-key add ${keyPath}.pub`.catch((err) => {
      console.error("Error registering SSH key with GitHub:", err);
      process.exit(1);
    });

    // Update ~/.ssh/config
    const sshConfigPath = `${os.homedir()}/.ssh/config`;
    await fs.appendFile(sshConfigPath, `\nHost github.com\n  IdentityFile ${keyPath}\n`).catch((err) => {
      console.error("Error updating SSH config:", err);
      process.exit(1);
    });

    // Check if Azure CLI is installed
    await $`az --version`.catch(() => {
      console.log("Installing Azure CLI...");
      if (process.platform === "linux") {
        $`curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash`.catch(() => {
          console.error("Failed to install Azure CLI on Linux.");
          process.exit(1);
        });
      } else if (process.platform === "darwin") {
        $`brew install azure-cli`.catch(() => {
          console.error("Failed to install Azure CLI on macOS.");
          process.exit(1);
        });
      } else {
        console.error("Unsupported platform for automatic installation of Azure CLI.");
        process.exit(1);
      }
    });

    // Add Azure DevOps extension
    await $`az extension add --name azure-devops`.catch((err) => {
      console.error("Error adding Azure DevOps extension:", err);
      process.exit(1);
    });

    // Azure login
    await $`az login`.catch((err) => {
      console.error("Error logging into Azure:", err);
      process.exit(1);
    });

    // Azure DevOps login
    await $`az devops login`.catch((err) => {
      console.error("Error logging into Azure DevOps:", err);
      process.exit(1);
    });

    // Azure ssh key add
    await $`az pipelines ssh-key add --ssh-public-key-file ${keyPath}.pub`.catch((err) => {
      console.error("Error adding SSH key to Azure:", err);
      process.exit(1);
    });

    // Update ~/.ssh/config
    await fs.appendFile(sshConfigPath, `\nHost ssh.dev.azure.com\n  IdentityFile ${keyPath}\n`).catch((err) => {
      console.error("Error updating SSH config:", err);
      process.exit(1);
    });

    console.log("SSH key generation and registration complete.");
  } catch (err) {
    console.error("An error occurred:", err);
    process.exit(1);
  }
}

async function github({
  username,
  email,
}) {
  // set git config
  await $`git config --global user.name ${username}`.catch((err) => {
    console.error("Error setting git username:", err);
    process.exit(1);
  });
  await $`git config --global user.email ${email}`.catch((err) => {
    console.error("Error setting git email:", err);
    process.exit(1);
  });

  // Check if GitHub CLI is installed
  await $`which gh`.catch(() => {
    console.log("Installing GitHub CLI...");
    if (process.platform === "linux") {
      $`sudo apt-get install gh`.catch(() => {
        console.error("Failed to install GitHub CLI on Linux.");
        process.exit(1);
      });
    } else if (process.platform === "darwin") {
      $`brew install gh`.catch(() => {
        console.error("Failed to install GitHub CLI on macOS.");
        process.exit(1);
      });
    } else {
      console.error("Unsupported platform for automatic installation of GitHub CLI.");
      process.exit(1);
    }
  });

  // Github login
  await $`gh auth login -h github.com -s admin:public_key`.catch((err) => {
    console.error("Error logging into GitHub:", err);
    process.exit(1);
  });

  // Generate SSH key
  const keyPath = `${os.homedir()}/.ssh/github_id_rsa`;
  await $`ssh-keygen -t rsa -b 4096 -f ${keyPath} -N ''`.catch((err) => {
    console.error("Error generating SSH key:", err);
    process.exit(1);
  });

  // Register SSH key with GitHub
  await $`gh ssh-key add ${keyPath}.pub`.catch((err) => {
    console.error("Error registering SSH key with GitHub:", err);
    process.exit(1);
  });

  // Update ~/.ssh/config
  const sshConfigPath = `${os.homedir()}/.ssh/config`;
  await fs.appendFile(sshConfigPath, `\nHost github.com\n  IdentityFile ${keyPath}\n`).catch((err) => {
    console.error("Error updating SSH config:", err);
    process.exit(1);
  });
}

async function azure({
  username,
  email,
}) {
  // set git config
  await $`git config --global user.name ${username}`.catch((err) => {
    console.error("Error setting git username:", err);
    process.exit(1);
  });
  await $`git config --global user.email ${email}`.catch((err) => {
    console.error("Error setting git email:", err);
    process.exit(1);
  });

  // Check if Azure CLI is installed
  await $`az --version`.catch(() => {
    console.log("Installing Azure CLI...");
    if (process.platform === "linux") {
      $`curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash`.catch(() => {
        console.error("Failed to install Azure CLI on Linux.");
        process.exit(1);
      });
    } else if (process.platform === "darwin") {
      $`brew install azure-cli`.catch(() => {
        console.error("Failed to install Azure CLI on macOS.");
        process.exit(1);
      });
    } else {
      console.error("Unsupported platform for automatic installation of Azure CLI.");
      process.exit(1);
    }
  });

  // Add Azure DevOps extension
  await $`az extension add --name azure-devops`.catch((err) => {
    console.error("Error adding Azure DevOps extension:", err);
    process.exit(1);
  });

  // Azure login
  await $`az login`.catch((err) => {
    console.error("Error logging into Azure:", err);
    process.exit(1);
  });

  // Azure DevOps login
  await $`az devops login`.catch((err) => {
    console.error("Error logging into Azure DevOps:", err);
    process.exit(1);
  });

  // Azure ssh key add
  await $`az pipelines ssh-key add --ssh-public-key-file ${keyPath}.pub`.catch((err) => {
    console.error("Error adding SSH key to Azure:", err);
    process.exit(1);
  });

  // Update ~/.ssh/config
  await fs.appendFile(sshConfigPath, `\nHost ssh.dev.azure.com\n  IdentityFile ${keyPath}\n`).catch((err) => {
    console.error("Error updating SSH config:", err);
    process.exit(1);
  });
}

async function main() {
  try {
    // intro with ASCII art and color
    console.log(`
    \x1b[36m
  First time setup CLI Tool
  https://github.com/froy-bookips/firset
       ______________  _____ ____________
      / ____/  _/ __ \\/ ___// ____/_  __/
     / /_   / // /_/ /\\__ \\/ __/   / /   
    / __/ _/ // _, _/___/ / /___  / /    
   /_/   /___/_/ |_|/____/_____/ /_/    
   
   This script will generate an SSH key and register it with GitHub or Azure.
    \x1b[0m
    `);

    // input username
    const username = await question("• please enter your username: ");

    // get email
    const email = await question("• please enter your email: ");

    // set git config
    await $`git config --global user.name ${username}`.catch((err) => {
      console.error("Error setting git username:", err);
      process.exit(1);
    });
    await $`git config --global user.email ${email}`.catch((err) => {
      console.error("Error setting git email:", err);
      process.exit(1);
    });

    // Ask user which service they want to setup
    const service = await question("• please enter the service you want to setup (github/azure): ");

    if (service.toLowerCase() === "github") {
      github({
        username,
        email,
      });
    } else if (service.toLowerCase() === "azure") {
      azure({
        username,
        email,
      });
    } else {
      console.error("Invalid service. Please enter either 'github' or 'azure'.");
      process.exit(1);
    }

    console.log("SSH key generation and registration complete.");
  } catch (err) {
    console.error("An error occurred:", err);
    process.exit(1);
  }
}

main();
