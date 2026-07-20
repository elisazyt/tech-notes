---
title: installing software
description: how packages are installed in python and ruby
categories: [software isolation]
tags: [python, pip, pypi, conda, ruby, gems, bundler]
pin: false
---

## package installers
pip and gem are the default package installers for Python and Ruby, respectively, used to install dependencies. When installing Python or Ruby, their binaries are already bundled with the rest of the installation scripts, so we never have to install them manually. The following commands are equivalent across pip (default for Python), conda (another option for Python with more options than pip which must be manually installed), and gem (for Ruby): `pip install package`, `gem install gem-name`, `conda install package`. All of these install packages from a software repository containing a wide range of programs, libraries, etc: [PyPI](https://pypi.org/) for pip, [repo.anaconda.com/pkgs/](https://repo.anaconda.com/pkgs/) for Anaconda, and [rubygems.org](https://rubygems.org) for Ruby.


## possible package formats
Packages can be installed in various formats. For example, conda packages and pip wheels are typically bundles (e.g. zip files) containing Python code, precompiled binaries for any code written in C/C++/Rust/etc, and other metadata. This is fast because no compilation is needed at install time, it just requires unzipping what's already there.

> pip wheels only apply to one specific combination of OS + CPU architecture + Python version. Therefore, if the wheel isn't available, pip will fall back to installing a tarball (`tar.gz`). The difference is that this tarball contains the raw C/C++/etc files instead of the precompiled binaries. This means they get compiled locally during installation, which is not as ideal.
{: .prompt-info }

## installing dependencies in python vs. ruby
In Python, pip or conda manage all the dependencies, which are unique to the virtual environment and project. However, since Ruby's rbenv only isolates by Ruby version (which can be shared across multiple projects), we need a separate dependency manager to further isolate by project. Bundler is Ruby's dependency manager. It reads the `Gemfile`, which specifies the exact dependency names and intended versions, and installs all the dependencies. Then, it creates a `Gemfile.lock` which records the names and versions of the packages that were actually installed (note that this initial resolution happens exactly once: the first time we run `bundle install`). From then on, whenever we enter the project again, Bundler reads `Gemfile.lock` to find the exact dependency and version to load, at a path like `~/.../<ruby-version>/.../<gem-name>`.

A Ruby gem is the equivalent of a Python package. A `Gemfile` is similar to `requirements.txt`, but Bundler requires an extra `Gemfile.lock` to dynamically resolve and load dependencies.

## package location
If applicable, these dependencies are installed in the directory dedicated to the project's venv (Python) or version (Ruby). Otherwise, they are installed in the directory where the system-wide Python or global Ruby version is located. For more information, see [virtual environments and version managers]({% post_url 2026-07-19-virtual_envs_etc %}).